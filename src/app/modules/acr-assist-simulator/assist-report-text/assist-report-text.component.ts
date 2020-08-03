import { Component, Input, OnChanges } from '@angular/core';
import { AllReportText, MainReportText } from 'testruleengine/Library/Models/Class';
import { AllTextReport, AllReportTextGroup } from '../../core/models/report-text.model';
import { TabularReport } from '../../core/models/tabular-report.model';
import { UtilityService } from '../../core/services/utility.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { head } from 'lodash';

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
  tabularReport: TabularReport;
  sections: string[] = [];

  @Input() reportText: MainReportText;

  constructor(
    private toastr: ToastrService,
    private utilityService: UtilityService
  ) {
  }

  ngOnChanges(): void {
    this.mainReportTexts = new MainReportText();
    this.onSelect(this.selectedSectionId);
  }

  onSelect(sectionId) {
    this.selectedSectionId = sectionId;
    this.sections = [];
    this.selectedSection = null;
    this.tabularReport = this.reportText.tabularReport;
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
            // this.reportText.allReportText[section].allReportResult.subSectionName !== undefined
            //   && this.reportText.allReportText[section].allReportResult.subSectionName !== '' ?
            //   this.reportText.allReportText[section].allReportResult.subSectionName
            //   : this.reportText.allReportText[section].allReportResult.sectionId;

            this.getHeadingBasedOnSectionId(this.reportText.allReportText[section].allReportResult.sectionId);
          textReport.allTextResultReport.sectionId = this.reportText.allReportText[section].allReportResult.sectionId;
          // tslint:disable-next-line:max-line-length
          textReport.allTextResultReport.content = this.addEmptyBreakLines(this.reportText.allReportText[section].allReportResult.reportText);
          textReport.repeatedSectionName = this.reportText.allReportText[section].repeatedSectionName;
          this.allTextReport.push(Object.assign({}, textReport));
        }
      }

      const results = _.chain(this.allTextReport).groupBy('repeatedSectionName').map(function (v, i) {
        return {
          repeatedSectionName: i,
          allTextResultReport: _.map(v, 'allTextResultReport'),

        };
      }).value();

      results.forEach(result => {
        result.allTextResultReport.forEach(y => {
          switch (y.sectionId.toLowerCase()) {
            case 'findings': y.sectionOrder = 1;
              break;

            case 'impressionRecommendation': y.sectionOrder = 2;
              break;

            case 'impression': y.sectionOrder = 3;
              break;

            case 'recommendation': y.sectionOrder = 4;
              break;

            case 'citation': y.sectionOrder = 5;
              break;
          }
        });
      });

      // const sortedResult = _.orderBy(results, [result => result.repeatedSectionName], ['asc']);
      // const sortedResult = _.sortBy(results, ['allTextResultReport.sectionOrder'], 'desc');
      results.forEach(x => {
        x.allTextResultReport = _.sortBy(x.allTextResultReport, function (_allTextResultReport) {
          return _allTextResultReport.sectionOrder;
        });
      });

      this.allReportTextGroup = results;
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
      // switch (allreportText.allReportResult.sectionId) {
      //   case 'findings': allreportText.allReportResult.sectionOrder = 1;
      //     break;

      //   case 'impressionRecommendation': allreportText.allReportResult.sectionOrder = 2;
      //     break;

      //   case 'impression': allreportText.allReportResult.sectionOrder = 3;
      //     break;

      //   case 'recomendation': allreportText.allReportResult.sectionOrder = 4;
      //     break;

      //   case 'citation': allreportText.allReportResult.sectionOrder = 5;
      //     break;
      // }

      this.allReportTexts.push(Object.assign({}, allreportText));
    }

    this.allReportTexts = _.orderBy(this.allReportTexts, 'allReportResult.sectionOrder', 'desc');

    this.mainReportTexts.allReportText = this.allReportTexts;
    this.mainReportTexts.reportTextMainContent = this.reportText.reportTextMainContent;
  }

  getHeadingBasedOnSectionId(sectionId: string) {
    let heading = '';
    switch (sectionId.toLowerCase()) {
      case 'findings': heading = 'Findings';
        break;

      case 'impressionRecommendation': heading = 'Impression Recommendation';
        break;

      case 'impression': heading = 'Impression';
        break;

      case 'recommendation': heading = 'Recommendation';
        break;

      case 'citation': heading = 'Citation';
        break;
    }

    return heading;
  }

  getReportIdentifier(identifer: string) {
    return this.utilityService.isNotEmptyString(identifer) ? `( ${identifer} )` : '';
  }

  addEmptyBreakLines(inputText: string): string {
    const hasEmptyLineBreak = inputText.trimRight().endsWith('<br>');
    if (!hasEmptyLineBreak) {
      return inputText + '<br>';
    }

    return inputText;
  }

  clipboardError(error: Error): void {
    this.toastr.error('Failed to copy to clipboard');
  }

  clipboardSuccess(value: string): void {
    this.toastr.success('Successfully copied to clipboard');
  }

  getReportTextInnerContent(reportTextContentForEmptySectionName) {
    if (this.utilityService.isValidInstance(reportTextContentForEmptySectionName)) {
      const msgb = reportTextContentForEmptySectionName.innerText.trim();
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = msgb;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.toastr.success('Successfully copied to clipboard');
    } else {
      this.toastr.error('Failed to copy to clipboard');
    }

    // return '';
  }
}
