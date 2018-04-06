import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { AllReportText, MainReportText } from '../assist-data-element/assist-data-element.component';
import { AllTextReport } from '../../core/models/report-text.model';
const $ = require('jquery');
@Component({
  selector: 'acr-assist-report-text',
  templateUrl: './assist-report-text.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AssistReportTextComponent implements OnChanges, AfterViewInit {

@Input() reportText: MainReportText;
allReportTexts: AllReportText [] = [];
selectedSection: string;
mainReportTexts: MainReportText;
selectedSectionId: string;
allTextReport: AllTextReport[];
sections: string [] = [];
prevSectionId: string;
ngOnChanges(changes: SimpleChanges): void {
  this.mainReportTexts = new MainReportText();
  this.onSelect(this.selectedSectionId);
  this.adjustReportTextHeight();
}

ngAfterViewInit(): void {
  this.adjustReportTextHeight();
}
  constructor() { }

  adjustReportTextHeight() {
    $('.content-area').css('height', $(window).height() + 100);
    const simualtorReportText = document.getElementsByClassName('left-margin');
    if (simualtorReportText.length === 0) {
      const height = $('.fixed-report-text-footer').height();
      let contentArea = $('.content-area').height();
      contentArea = contentArea - ((1.4 * height) + 75);
      $('.content-area').css('height', contentArea);
    }
  }
  onSelect(sectionId) {
    this.selectedSectionId = sectionId;
    this.sections = [];
    this.selectedSection = null;
    for (const section in this.reportText.allReportText) {
      if (this.reportText.allReportText[section].reportText !== '' || this.reportText.allReportText[section].sectionId === 'findings') {
        this.sections.push(section);
      }
    }
    if (this.sections.length > 1) {
      if (sectionId === 'undefined' || sectionId === undefined || sectionId === 'All' ) {
        let allText: string;
        this.allTextReport = [];
        allText = '';
        for (const section in this.reportText.allReportText) {
          const textReport: AllTextReport = new AllTextReport();
          textReport.heading =  section;
          textReport.content = this.removeEmptyLine(this.reportText.allReportText[section].reportText);
          this.allTextReport.push (textReport);
        }
        // $('#allTextReport').html(allText);
        this.selectedSectionId = 'All';
      }
    } else {
      sectionId = 'findings';
    }
    for (const section in this.reportText.allReportText) {
      if (this.reportText.allReportText[section].sectionId === sectionId) {
        this.selectedSection = this.reportText.allReportText[section].reportText;
        this.selectedSection = this.reportText.reportTextMainContent + ((this.selectedSection !== undefined && this.selectedSection !== '') ? this.removeEmptyLine(this.selectedSection.replace(new RegExp(' ', 'g'), '&nbsp;')) : '');
        break;
      }
    }
    this.mainReportTexts = new MainReportText();
    this.allReportTexts = [];
    for (const section in this.reportText.allReportText) {
      const allreportText = new AllReportText();
      allreportText.reportText = this.removeEmptyLine(this.reportText.allReportText[section].reportText.replace(new RegExp(' ', 'g'), '&nbsp;'));
      allreportText.sectionId = this.reportText.allReportText[section].sectionId;
      this.allReportTexts.push(allreportText);
    }
    this.mainReportTexts.allReportText = this.allReportTexts;
    this.mainReportTexts.reportTextMainContent = this.reportText.reportTextMainContent;
}
removeEmptyLine(inputText: string): string {
    if (inputText.trim().length !== 0) {
      const lines = inputText.split('\n');
      const uniquelines = [];
      lines.forEach( function (line, i) {
          if (line.trim().length !== 0) {
            uniquelines.push(line);
          }
      });
      return uniquelines.join('\n');
    }
  }
}
