import { Component, Input } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
export class ValueBlockComponent {
    /**
     * @param {?} globalsService
     */
    constructor(globalsService) {
        this.globalsService = globalsService;
        this.DataElements = {};
        this.FormValues = {};
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    evaluate(exp) {
        if (this.ValueBlock.ParentID === '0' && this.ValueBlock.Level === 0 && this.ValueBlock.Index === 0) {
            this.globalsService.ComputedElementConditions[this.DataElement.ID] = {};
            this.FormValues[this.DataElement.ID] = '';
        }
        if (this.FormValues[this.DataElement.ID] !== '') {
            return false;
        }
        if (exp === '') {
            return true;
        }
        const /** @type {?} */ result = eval(exp);
        if (result) {
            const /** @type {?} */ temp = this.globalsService.ComputedElementConditions[this.DataElement.ID];
            temp[this.ValueBlock.ParentID] = this.ValueBlock.Index;
            this.globalsService.ComputedElementConditions[this.DataElement.ID] = temp;
            if (this.ValueBlock.TextExpression !== undefined && this.ValueBlock.TextExpression.length > 0) {
                this.FormValues['hasAbnormality'] = this.textify(this.ValueBlock.TextExpression);
            }
            else if (this.ValueBlock.ArithmeticExpression !== '') {
                this.FormValues['hasAbnormality'] = this.compute(this.ValueBlock.ArithmeticExpression);
            }
        }
        return result;
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    validate(exp) {
        if (exp === '') {
            return false;
        }
        return eval(exp);
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    compute(exp) {
        const /** @type {?} */ result = eval(exp);
        this.DataElement.Value = result;
        this.FormValues[this.DataElement.ID] = result;
        return result;
    }
    /**
     * @param {?} textBlocks
     * @return {?}
     */
    textify(textBlocks) {
        let /** @type {?} */ res = '';
        if (textBlocks.constructor.name === 'String') {
            res += textBlocks;
        }
        else if (textBlocks.length > 0) {
            textBlocks.forEach(text => {
                if (text.constructor.name === 'String') {
                    res += text;
                }
                else if (text.constructor.name === 'Object') {
                    res += ' ' + this.FormValues[text.InsertValue.Attr.DataElementId] + ' ';
                }
            });
        }
        this.FormValues[this.DataElement.ID] = res;
        return res;
    }
}
ValueBlockComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-value-block',
                template: `
    <ng-container *ngIf="!validate(ValueBlock.ValidationCondition)">
      <ng-container *ngIf="evaluate(ValueBlock.Condition)">
          <ng-container *ngIf="ValueBlock.ArithmeticExpression !=''">
              <ng-container *ngIf="DataElement.ShowValue">
                  <label class="control-label DEElement">  {{compute(ValueBlock.ArithmeticExpression)}}</label>
              </ng-container>
              <ng-container *ngIf="!DataElement.ShowValue">
                  <input type="hidden"   [attr.value]="compute(ValueBlock.ArithmeticExpression)" />
              </ng-container>
          </ng-container>
          <ng-container *ngIf="ValueBlock.TextExpression !== '' && ValueBlock.TextExpression !=undefined ">
              <ng-container *ngIf="DataElement.ShowValue">
                  <label class="control-label DEElement">  {{textify(ValueBlock.TextExpression)}}</label>
              </ng-container>
              <ng-container *ngIf="!DataElement.ShowValue">
                  <input type="hidden"   [attr.value]="textify(ValueBlock.TextExpression)" />
              </ng-container>
          </ng-container>
          <ng-container *ngIf="ValueBlock.NestedBlocks.length > 0">
              <ng-container *ngFor="let NestedBlock of ValueBlock.NestedBlocks">
                  <acr-value-block [ValueBlock]="NestedBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-value-block>
              </ng-container>
          </ng-container>
      </ng-container>

      <ng-container *ngIf="ValueBlock.ElseBlocks.length > 0">
          <ng-container *ngIf="!evaluate(ValueBlock.Condition)">
              <ng-container *ngFor="let ElseBlock of ValueBlock.ElseBlocks">
                  <acr-value-block [ValueBlock]="ElseBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-value-block>
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
ValueBlockComponent.ctorParameters = () => [
    { type: GlobalsService, },
];
ValueBlockComponent.propDecorators = {
    'ValueBlock': [{ type: Input },],
    'DataElement': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
};
function ValueBlockComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    ValueBlockComponent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ValueBlockComponent.ctorParameters;
    /** @type {?} */
    ValueBlockComponent.propDecorators;
    /** @type {?} */
    ValueBlockComponent.prototype.ValueBlock;
    /** @type {?} */
    ValueBlockComponent.prototype.DataElement;
    /** @type {?} */
    ValueBlockComponent.prototype.DataElements;
    /** @type {?} */
    ValueBlockComponent.prototype.FormValues;
    /** @type {?} */
    ValueBlockComponent.prototype.globalsService;
}
//# sourceMappingURL=value-block.component.js.map