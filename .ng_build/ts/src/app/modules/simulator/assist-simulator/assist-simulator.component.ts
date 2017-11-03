import { Component, OnInit, Input} from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-assist-simulator',
  template: `


    <canvas id='Can-ImgMap'></canvas>
    <ng-container *ngFor="let DataElement of DataElements">

    	<ng-container *ngIf="(DataElement.ElementType == 'ComputedElement')">
    		<acr-computed-element [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-computed-element>
    	</ng-container>


    	<ng-container *ngIf="(DataElement.ElementType == 'ChoiceDataElement' || DataElement.ElementType == 'NumericDataElement' || DataElement.ElementType == 'IntegerDataElement' || DataElement.ElementType == 'MultiChoiceDataElement') ">
    		<ng-container *ngIf="DataElement.Visible">
    			<div class="form-group" [class.Visible]="DataElement.Visible">
                    <div class="col-sm-3">
                        <label class="control-label DEElement" id="{{DataElement.ID}}">
                            {{DataElement.Label}}
                        </label>

                        <ng-container *ngIf="!common.isEmpty(DataElement.Hint) ">
                            <a > <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="right" title="{{DataElement.Hint}}"></span>							</a>
                        </ng-container>

                        <ng-container *ngIf="DataElement.Diagrams != Undefined ">
                            <acr-hint-diagram [DataElement]="DataElement"></acr-hint-diagram>
                        </ng-container>

                        <ng-container *ngIf="ValidationBlocks.length > 0">
                            <ng-container *ngFor="let Block of ValidationBlocks">
                                <ng-container *ngIf="(DataElementObj[DataElement.ID].Visible)">
                                    <ng-container *ngIf="evaluate(Block.Condition)">
                                        <ng-container *ngIf="Block.DataElementID == DataElement.ID">
                                            <ng-container *ngIf="Block.Message =='Minimum value required'">
                                                <div class="required-field">Minimum Value: {{Block.Minimum}}</div>
                                            </ng-container>

                                            <ng-container *ngIf="Block.Message != 'Minimum value required'">
                                                <div class="required-field">* Required field !!!</div>
                                            </ng-container>
                                        </ng-container>
                                    </ng-container>
                                </ng-container>
                            </ng-container>
                        </ng-container>
                    </div>

    				<div class="col-sm-8 ">
    					<div class="input-group ">
    						<!--Choice DataElements-->
    						<ng-container *ngIf="DataElement.ElementType == 'ChoiceDataElement' ">
                                <div class="table no-btm-margin-table">
                                    <div class="table-row">
                                        <div class="table-cell">
                                            <ng-container *ngIf="DataElement.ChoiceOptions.length == 2">
                                                <!-- Full width for radio if Imagepath exist -->
                                                <ng-container *ngIf="DataElement.ImagePath != Undefined">
                                                    <div id="radio-inline">
                                                        <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                                                            <label class="rad DEValues">
                                                                <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}} checked style="display:none;">
                                                                <div class="full-width" (click)="itemSelected()">
                                                                    <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                                                           checked>
                                                                    <span>{{choice.Label}}</span>
                                                                </div>
                                                            </label>
                                                        </ng-container>
                                                    </div>
                                                </ng-container>
                                                <!-- Full width for radio if Imagepath does not exist -->
                                                <ng-container *ngIf="DataElement.ImagePath == Undefined">
                                                    <div id="radio-inline">
                                                        <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                                                            <label class="rad DEValues">
                                                                <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}} checked style="display:none;">
                                                                <div class="full-width" (click)="itemSelected()">
                                                                    <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                                                           checked>
                                                                    <span>{{choice.Label}}</span>
                                                                </div>
                                                            </label>
                                                        </ng-container>
                                                    </div>
                                                </ng-container>
                                            </ng-container>
                                            <ng-container *ngIf="DataElement.ChoiceOptions.length != 2">
                                                <!-- Dropdown will be created if choice options have more than 5 choices-->
                                                <ng-container *ngIf="DataElement.ChoiceOptions.length > 5">
                                                    <select id="{{DataElement.ID}}" [(ngModel)]="FormValues[DataElement.ID]" (ngModelChange)="itemSelected()">
                                                        <option [value]="Select">--Select--</option>
                                                        <option *ngFor="let choice of DataElement.ChoiceOptions" [value]="choice.Value">{{choice.Label}}</option>
                                                    </select>
                                                </ng-container>
                                                <!-- Radio button will be created if choice options have are <=5 choices-->
                                                <ng-container *ngIf="DataElement.ChoiceOptions.length <= 5">
                                                    <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                                                        <div id="radio-inline">
                                                            <label class="rad DEValues">
                                                                <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}} checked style="display:none;">
                                                                <div class="full-width" (click)="itemSelected()">
                                                                    <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                                                           checked>
                                                                    <span>{{choice.Label}}</span>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </ng-container>
                                                </ng-container>
                                            </ng-container>
                                        </div>
                                        <!-- imagemap will be displyed here -->
                                        <ng-container *ngIf="DataElement.ImagePath != Undefined">
                                            <div class="table-cell">
                                                <acr-image-map [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-image-map>
                                            </div>
                                        </ng-container>
                                    </div>
                                </div>
    						</ng-container>
    						<!--Multi Choice DataElements-->
    						<ng-container *ngIf="DataElement.ElementType == 'MultiChoiceDataElement' ">
    							<ng-container *ngFor="let choice of DataElement.ChoiceOptions">
    								<div class="checkbox">
                                        <label class="full-width">
                                            <input type="checkbox" value={{choice.Value}} (change)="updateMultichoice(DataElement.ID,choice.Value,$event)">
                                            <span> {{choice.Label}}</span>
                                        </label>
    								</div>
    							</ng-container>
    						</ng-container>

    						<!--NumericDataElement-->
    						<ng-container *ngIf="DataElement.ElementType == 'NumericDataElement' ">
    							<input type="number" [(ngModel)]="FormValues[DataElement.ID]" class="form-control" name="FormValues['{{DataElement.ID}}']" (keypress)="itemSelected()">
    						</ng-container>
    					</div>
    				</div>
    			</div>
    		</ng-container>
    	</ng-container>
    </ng-container>
  `,
  styles: [`

  `]
})
export class AssistSimulatorComponent implements OnInit {

  @Input() DataElements: DataElement[] = [];
  @Input() FormValues: Object = {};
  @Input() ValidationBlocks = [];
  DataElementObj = {};

  constructor() { }

  ngOnInit() {
  }

}
