import { Component, OnInit, Input } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';
import { StringUtilityService } from '../shared/services/string-utility.service';

@Component({
  selector: 'acr-computed-element',
  template: `
    <ng-container *ngIf="DataElement.Visible && DataElement.ShowValue">
      <div class="form-group" [class.Visible]="(DataElement.Visible && DataElement.ShowValue)">

          <div class="col-sm-3">
              <label class="control-label DEElement" id="{{DataElement.ID}}">
                  {{DataElement.ID}}
              </label>
              <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.Hint) ">
                  <a>
                      <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="{{DataElement.Hint}}"></span>
                  </a>
              </ng-container>
          </div>
          <div class="col-sm-6">

              <ng-container *ngFor="let valueBlock of DataElement.ValueBlocks">
                  <acr-value-block [ValueBlock]="valueBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues">
                  </acr-value-block>
              </ng-container>

              <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.ArithmaticExpression)">
                  <label class="control-label DEElement"> {{compute(DataElement.ArithmaticExpression)}}</label>
              </ng-container>
              <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.TextExpression)">
                  <label class="control-label DEElement"> {{textify(DataElement.TextExpression)}}</label>
              </ng-container>
          </div>
      </div>

    </ng-container>

    <ng-container *ngIf="!DataElement.ShowValue">
      <ng-container *ngFor="let valueBlock of DataElement.ValueBlocks">
          <acr-value-block [ValueBlock]="valueBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues">

          </acr-value-block>

      </ng-container>

      <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.ArithmaticExpression)">
          <input type="hidden" [attr.value]="compute(DataElement.ArithmaticExpression)" />
      </ng-container>
      <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.TextExpression)">
          <input type="hidden" [attr.value]="textify(DataElement.TextExpression)" />
      </ng-container>

    </ng-container>
  `,
  styles: [`

  `]
})
export class ComputedElementComponent {

  @Input() DataElement: DataElement;
  @Input() DataElements: Object = {};
  @Input() FormValues: Object = {};


  constructor(private stringUtilityService: StringUtilityService) {

  }

  compute(exp) {
    const result = eval(exp);
    this.DataElement.Value = result;
    this.FormValues[this.DataElement.ID] = result;
    return result;
  }

  textify(textBlocks) {
    let result = '';
    if (textBlocks.constructor.name === 'String') {
      result += textBlocks;
    } else if (textBlocks.length > 0) {
      textBlocks.forEach(text => {
        if (text.constructor.name === 'String') {
          result += text;
        } else if (text.constructor.name === 'Object') {
          result += ' ' +  this.FormValues[text.InsertValue.Attr.DataElementId] + ' ';
        }
      });
    }
    this.FormValues[this.DataElement.ID] = result;
    return result;
  }
}
