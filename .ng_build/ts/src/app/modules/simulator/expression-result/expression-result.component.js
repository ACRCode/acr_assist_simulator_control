import { Component, Input } from '@angular/core';
export class ExpressionResultComponent {
    constructor() {
        this.FormValues = {};
        this.DataElements = [];
        this.sectionResult = '';
        this.selectedSection = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.Result.ReportSections.length > 0) {
            this.selectedSection = this.Result.ReportSections[0].Heading;
        }
    }
    /**
     * @return {?}
     */
    getResultText() {
        const /** @type {?} */ res = {};
        for (const /** @type {?} */ section of this.Result.ReportSections) {
            const /** @type {?} */ sectionResult = this.generateSectionResult(section);
            res[sectionResult.Heading] = sectionResult.ReportText;
        }
        return res;
    }
    /**
     * @param {?} reportSection
     * @return {?}
     */
    generateSectionResult(reportSection) {
        const /** @type {?} */ reportText = this.textifyReportText(reportSection.ReportTexts);
        return { 'Heading': reportSection.Heading, 'ReportText': reportText };
    }
    /**
     * @param {?} reportTexts
     * @return {?}
     */
    textifyReportText(reportTexts) {
        let /** @type {?} */ res = '';
        for (const /** @type {?} */ reportText of reportTexts) {
            if (reportText.ResultText !== '') {
                res += reportText.ResultText;
            }
            if (reportText.DataElementID !== '') {
                res += this.FormValues[reportText.DataElementID];
            }
            if (reportText.Condition !== '') {
                if (this.evaluate(reportText.Condition)) {
                    res += this.textifyReportText(reportText.NestedReportText);
                }
            }
            if (reportText.Condition === '') {
                res += this.textifyReportText(reportText.NestedReportText);
            }
        }
        return res;
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    evaluate(cond) {
        if (cond === '') {
            return false;
        }
        const /** @type {?} */ res = eval(cond);
        return res;
    }
}
ExpressionResultComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-expression-result',
                template: `
    <div class="panel panel-default">

      <div class="panel-heading text-left">
        Report Text: <select id="ddlSections" (change)="generateReportText()" [(ngModel)]="selectedSection">
          <ng-container *ngFor="let Section of Result.ReportSections">
            <option [value]="Section.Heading" [selected]="Section.Heading == 'findings'">{{Section.Heading}}</option>
          </ng-container>
        </select>
      </div>
    </div>
    <div>
      <ng-container *ngFor="let Section of Result.ReportSections">
        <ng-container *ngIf="selectedSection == Section.Heading">
          <acr-report-text [ReportTexts]="Section.ReportTexts" [FormValues]="FormValues"></acr-report-text>
        </ng-container>
      </ng-container>
    </div>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
ExpressionResultComponent.ctorParameters = () => [];
ExpressionResultComponent.propDecorators = {
    'ExpBlock': [{ type: Input },],
    'Result': [{ type: Input },],
    'FormValues': [{ type: Input },],
    'DataElements': [{ type: Input },],
};
function ExpressionResultComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    ExpressionResultComponent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ExpressionResultComponent.ctorParameters;
    /** @type {?} */
    ExpressionResultComponent.propDecorators;
    /** @type {?} */
    ExpressionResultComponent.prototype.ExpBlock;
    /** @type {?} */
    ExpressionResultComponent.prototype.Result;
    /** @type {?} */
    ExpressionResultComponent.prototype.FormValues;
    /** @type {?} */
    ExpressionResultComponent.prototype.DataElements;
    /** @type {?} */
    ExpressionResultComponent.prototype.sectionResult;
    /** @type {?} */
    ExpressionResultComponent.prototype.selectedSection;
    /** @type {?} */
    ExpressionResultComponent.prototype.result;
}
//# sourceMappingURL=expression-result.component.js.map