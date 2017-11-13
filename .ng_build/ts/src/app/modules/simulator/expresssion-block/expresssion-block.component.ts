import { Component, OnInit , Input , Output , EventEmitter } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-expresssion-block',
  template: `


        <ng-container *ngIf="!validate(ExpBlock.ValidationCondition)">

             <ng-container *ngIf="evaluate(ExpBlock.Condition, ExpBlock.NotRelavantDataElements)">
              <ng-container *ngIf="(ExpBlock.Result != undefined)">
              <acr-expression-result [DataElements]="DataElements" [ExpBlock]="ExpBlock" [Result]="ExpBlock.Result" [FormValues]="FormValues"></acr-expression-result>
             </ng-container>

            <ng-container *ngIf="ExpBlock.NestedBlocks.length > 0">
              <ng-container *ngFor="let NestedBlock of ExpBlock.NestedBlocks">
                    <acr-expresssion-block [ExpBlock]="NestedBlock" [FormValues]="FormValues" [DataElements]="DataElements" ></acr-expresssion-block>
              </ng-container>
            </ng-container>
          </ng-container>

          <ng-container *ngIf="ExpBlock.ElseBlocks.length > 0">
            <ng-container *ngIf="!evaluate(ExpBlock.Condition,ExpBlock.NotRelavantDataElements)">
              <ng-container *ngFor="let ElseBlock of ExpBlock.ElseBlocks">
               <acr-expresssion-block [ExpBlock]="ElseBlock" [FormValues]="FormValues" [DataElements]="DataElements"> </acr-expresssion-block>
              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>
  `,
  styles: [`

  `]
})
export class ExpresssionBlockComponent   {
  @Input() FormValues: Object = {};
  @Input() ExpBlock: ExpressionBlock = new ExpressionBlock();
  @Input() DataElements: DataElement[] = [];
  @Output() onExpressionChanged: EventEmitter<DataElement[]> = new EventEmitter<DataElement[]>();

  constructor(private globalsService: GlobalsService) {

   }

  validate(cond) {
      if (cond === '') {
          return false;
      }
      return eval(cond);
  }

  evaluate(cond, notRelevantDataElments) {
     if (cond === '') {
          return false;
      }
      const result = eval(cond);
      if (result && this.globalsService.evaluateExpessions) {
          this.onExpressionChanged.emit(this.ExpBlock.NotRelavantDataElements);
      }
      return result;
  }

}
