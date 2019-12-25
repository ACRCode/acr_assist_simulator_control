import { Component, Input, OnChanges } from '@angular/core';
import { AllReportText, MainReportText } from 'testruleengine/Library/Models/Class';
import { AllTextReport, AllReportTextGroup } from '../../core/models/report-text.model';
import * as _ from 'lodash';
import { TabularReport } from '../../core/models/tabular-report.model';
@Component({
  selector: 'acr-assist-report-text',
  templateUrl: './assist-report-text.component.html',
  styleUrls: ['./assist-report-text.component.css', '../styles.css']
})
export class AssistReportTextComponent implements OnChanges {

  prevSectionId: string;
  selectedSectionId: string;
  selectedSection: string;
  allReportTextGroup: AllReportTextGroup[] = [];
  allReportTexts: AllReportText[] = [];
  mainReportTexts: MainReportText;
  allTextReport: AllTextReport[];
  tabularReports: TabularReport[];
  sections: string[] = [];

  @Input() reportText: MainReportText;

  constructor() {
    setInterval(() => {
    }, 1000);
  }

  ngOnChanges(): void {
    this.mainReportTexts = new MainReportText();
    this.onSelect(this.selectedSectionId);
  }

  onSelect(sectionId) {
    this.selectedSectionId = sectionId;
    this.sections = [];
    this.selectedSection = null;
    this.tabularReports = this.reportText.tabularReport;
    for (const section in this.reportText.allReportText) {
      if (this.reportText.allReportText[section].allReportResult.reportText !== '') {
        this.sections.push(section);
      }
    }
    if (sectionId === 'undefined' || sectionId === undefined || sectionId === 'All') {
      let allText: string;
      this.allTextReport = [];
      allText = '';
      for (const section in this.reportText.allReportText) {
        if (this.reportText.allReportText[section].allReportResult.reportText !== '') {
          const textReport: AllTextReport = new AllTextReport();
          textReport.allTextResultReport.heading =
            this.reportText.allReportText[section].allReportResult.subSectionName !== undefined
              && this.reportText.allReportText[section].allReportResult.subSectionName !== '' ?
              this.reportText.allReportText[section].allReportResult.subSectionName
              : this.reportText.allReportText[section].allReportResult.sectionId;
          // tslint:disable-next-line:max-line-length
          textReport.allTextResultReport.content = this.addEmptyBreakLines(this.reportText.allReportText[section].allReportResult.reportText);
          textReport.repeatedSectionName = this.reportText.allReportText[section].repeatedSectionName;
          this.allTextReport.push(Object.assign({}, textReport));
        }
      }

      const results = _.chain(this.allTextReport).groupBy('repeatedSectionName').map(function(v, i) {
        return {
          repeatedSectionName: i,
          allTextResultReport: _.map(v, 'allTextResultReport')
        };
      }).value();

      const sortedResult = _.orderBy(results, [result => result.repeatedSectionName], ['asc']);
      this.allReportTextGroup = sortedResult;
      this.selectedSectionId = 'All';
    }

    for (const section in this.reportText.allReportText) {
      if (this.reportText.allReportText[section].allReportResult.sectionId === sectionId) {
        this.selectedSection = this.reportText.allReportText[section].allReportResult.reportText;
        // tslint:disable-next-line:max-line-length
        this.selectedSection = this.reportText.reportTextMainContent + ((this.selectedSection !== undefined && this.selectedSection !== '') ? this.addEmptyBreakLines(this.selectedSection) : '');
        break;
      }
    }

    this.mainReportTexts = new MainReportText();
    this.allReportTexts = [];
    // tslint:disable-next-line:forin
    for (const section in this.reportText.allReportText) {
      const allreportText = new AllReportText();
      allreportText.allReportResult.reportText = this.addEmptyBreakLines(this.reportText.allReportText[section].allReportResult.reportText);
      allreportText.allReportResult.sectionId = this.reportText.allReportText[section].allReportResult.sectionId;
      allreportText.repeatedSectionName = this.reportText.allReportText[section].repeatedSectionName;
      this.allReportTexts.push(Object.assign({}, allreportText));
    }
    this.mainReportTexts.allReportText = this.allReportTexts;
    this.mainReportTexts.reportTextMainContent = this.reportText.reportTextMainContent;
  }

  addEmptyBreakLines(inputText: string): string {
    const hasEmptyLineBreak = inputText.trimRight().endsWith('<br>');
    if (!hasEmptyLineBreak) {
      return inputText + '<br>';
    }

    return inputText;
  }
}
