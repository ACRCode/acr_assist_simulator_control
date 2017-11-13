import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
export class ExpresssionBlockComponent {
    /**
     * @param {?} globalsService
     */
    constructor(globalsService) {
        this.globalsService = globalsService;
        this.FormValues = {};
        this.ExpBlock = new ExpressionBlock();
        this.DataElements = [];
        this.onExpressionChanged = new EventEmitter();
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    validate(cond) {
        if (cond === '') {
            return false;
        }
        return eval(cond);
    }
    /**
     * @param {?} cond
     * @param {?} notRelevantDataElments
     * @return {?}
     */
    evaluate(cond, notRelevantDataElments) {
        if (cond === '') {
            return false;
        }
        const /** @type {?} */ result = eval(cond);
        if (result && this.globalsService.evaluateExpessions) {
            this.onExpressionChanged.emit(this.ExpBlock.NotRelavantDataElements);
        }
        return result;
    }
}
ExpresssionBlockComponent.decorators = [
    { type: Component, args: [{
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
            },] },
];
/**
 * @nocollapse
 */
ExpresssionBlockComponent.ctorParameters = () => [
    { type: GlobalsService, },
];
ExpresssionBlockComponent.propDecorators = {
    'FormValues': [{ type: Input },],
    'ExpBlock': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'onExpressionChanged': [{ type: Output },],
};
function ExpresssionBlockComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    ExpresssionBlockComponent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ExpresssionBlockComponent.ctorParameters;
    /** @type {?} */
    ExpresssionBlockComponent.propDecorators;
    /** @type {?} */
    ExpresssionBlockComponent.prototype.FormValues;
    /** @type {?} */
    ExpresssionBlockComponent.prototype.ExpBlock;
    /** @type {?} */
    ExpresssionBlockComponent.prototype.DataElements;
    /** @type {?} */
    ExpresssionBlockComponent.prototype.onExpressionChanged;
    /** @type {?} */
    ExpresssionBlockComponent.prototype.globalsService;
}
//# sourceMappingURL=expresssion-block.component.js.map