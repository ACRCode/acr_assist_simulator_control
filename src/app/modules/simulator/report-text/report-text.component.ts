import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReportText } from '../shared/models/report-text.model';

@Component({
    selector: 'acr-report-text',
    templateUrl: './report-text.component.html',
    styleUrls: ['../../styles.css']
})
export class ReportTextComponent {

    @Input() FormValues: Object = {};
    @Input() ReportTexts: ReportText[] = [];


    evaluate(cond) {
        if (cond === '') {
            return false;
        }
        return eval(cond);
    }

    InsertValue(dataElementID) {
        if (Array.isArray(this.FormValues[dataElementID])) {
            return this.FormValues[dataElementID].join(', ');
        }
        return this.FormValues[dataElementID];
    }

    FormatReportText(reportText: string) {
        if (reportText.indexOf('\\n') !== -1) {
            reportText = reportText.replace(/\\n/g, '<br />');
        }
        if (reportText.indexOf('\\t') !== -1) {
            reportText = reportText.replace(/\\t/g, '    ');
        }

        return reportText;
    }
}
