import { Component, Input } from '@angular/core';
export class ReportTextComponent {
    constructor() {
        this.FormValues = {};
        this.ReportTexts = [];
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    evaluate(cond) {
        if (cond === '') {
            return false;
        }
        return eval(cond);
    }
    /**
     * @param {?} dataElementID
     * @return {?}
     */
    InsertValue(dataElementID) {
        if (Array.isArray(this.FormValues[dataElementID])) {
            return this.FormValues[dataElementID].join(', ');
        }
        return this.FormValues[dataElementID];
    }
}
ReportTextComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-report-text',
                template: `
    <ng-container *ngFor="let ReportText of ReportTexts">
      <ng-container *ngIf="ReportText.ResultText != ''">
        <div >
          <label> {{ReportText.ResultText}} </label>
        </div>
      </ng-container>
      <ng-container *ngIf="ReportText.DataElementID != ''">
        <div >
          <label> {{InsertValue(ReportText.DataElementID)}} </label>
        </div>
        <br/>
      </ng-container>

      <ng-container *ngIf="ReportText.Condition != ''">
        <ng-container *ngIf="evaluate(ReportText.Condition)">
          <acr-report-text [ReportTexts]="ReportText.NestedReportText" [FormValues]="FormValues"></acr-report-text>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="ReportText.Condition == ''">
        <acr-report-text [ReportTexts]="ReportText.NestedReportText" [FormValues]="FormValues"></acr-report-text>
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
ReportTextComponent.ctorParameters = () => [];
ReportTextComponent.propDecorators = {
    'FormValues': [{ type: Input },],
    'ReportTexts': [{ type: Input },],
};
function ReportTextComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    ReportTextComponent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ReportTextComponent.ctorParameters;
    /** @type {?} */
    ReportTextComponent.propDecorators;
    /** @type {?} */
    ReportTextComponent.prototype.FormValues;
    /** @type {?} */
    ReportTextComponent.prototype.ReportTexts;
}
//# sourceMappingURL=report-text.component.js.map