import { Component, Input, OnChanges } from '@angular/core';
import { AllReportText, MainReportText } from 'testruleengine/Library/Models/Class';
import { AllTextReport, AllReportTextGroup } from '../../core/models/report-text.model';
const $ = require('jquery');
import * as _ from 'lodash';

@Component({
  selector: 'acr-assist-report-text',
  templateUrl: './assist-report-text.component.html',
  styleUrls: ['./assist-report-text.component.css', '../styles.css']
})
export class AssistReportTextComponent implements OnChanges {

  allReportTextGroup: AllReportTextGroup[] = [];
  @Input() reportText: MainReportText;
  allReportTexts: AllReportText[] = [];
  selectedSection: string;
  mainReportTexts: MainReportText;
  selectedSectionId: string;
  allTextReport: AllTextReport[];
  sections: string[] = [];
  prevSectionId: string;

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
          textReport.allTextResultReport.heading = this.reportText.allReportText[section].allReportResult.sectionId;
          textReport.allTextResultReport.content = this.removeEmptyLine(this.reportText.allReportText[section].allReportResult.reportText);
          textReport.repeatedSectionName = this.reportText.allReportText[section].repeatedSectionName;
          this.allTextReport.push(Object.assign({}, textReport));
        }
      }

      const results = _.chain(this.allTextReport).groupBy('repeatedSectionName').map(function (v, i) {
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
        this.selectedSection = this.reportText.reportTextMainContent + ((this.selectedSection !== undefined && this.selectedSection !== '') ? this.removeEmptyLine(this.selectedSection) : '');
        break;
      }
    }
    this.mainReportTexts = new MainReportText();
    this.allReportTexts = [];
    for (const section in this.reportText.allReportText) {
      const allreportText = new AllReportText();
      allreportText.allReportResult.reportText = this.removeEmptyLine(this.reportText.allReportText[section].allReportResult.reportText);
      allreportText.allReportResult.sectionId = this.reportText.allReportText[section].allReportResult.sectionId;
      allreportText.repeatedSectionName = this.reportText.allReportText[section].repeatedSectionName;
      this.allReportTexts.push(Object.assign({}, allreportText));
    }
    this.mainReportTexts.allReportText = this.allReportTexts;
    this.mainReportTexts.reportTextMainContent = this.reportText.reportTextMainContent;
  }

  removeEmptyLine(inputText: string): string {
    if (inputText.trim().length !== 0) {
      const lines = inputText.split('\n');
      const uniquelines = [];
      lines.forEach(function (line, i) {
        if (line.trim().length !== 0) {
          uniquelines.push(line);
        }
      });
      return uniquelines.join('\n');
    }
  }
}
