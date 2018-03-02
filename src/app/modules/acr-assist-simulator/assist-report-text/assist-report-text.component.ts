import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllReportText, MainReportText } from '../assist-data-element/assist-data-element.component';

@Component({
  selector: 'acr-assist-report-text',
  templateUrl: './assist-report-text.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AssistReportTextComponent implements OnChanges {
@Input() reportText: MainReportText;
allReportTexts: AllReportText [] = [];
selectedSection: string;
mainReportTexts: MainReportText;
selectedSectionId: string;
sections: string [] = [];
ngOnChanges(changes: SimpleChanges): void {
  this.mainReportTexts = new MainReportText();
  this.onSelect(this.reportText.allReportText['findings'].sectionId);

  }
  constructor() { }

  onSelect(sectionId) {
    this.selectedSectionId = (sectionId === 'undefined') ? 'All' : sectionId;
    this.sections = [];
    this.selectedSection = null;
    for (const section in this.reportText.allReportText) {
      if (this.reportText.allReportText[section].reportText !== '' || this.reportText.allReportText[section].sectionId === 'findings') {
        this.sections.push(section);
      }
    }
    for (const section in this.reportText.allReportText) {
      if (this.reportText.allReportText[section].sectionId === sectionId) {
        this.selectedSection = this.reportText.allReportText[section].reportText;
        this.selectedSection = this.removeEmptyLine(this.selectedSection.replace(new RegExp(' ', 'g'), '&nbsp;'));
        break;
      }
    }
    this.mainReportTexts = new MainReportText();
    this.allReportTexts = [];
    for (const section in this.reportText.allReportText) {
      const allreportText = new AllReportText();
      allreportText.reportText = this.reportText.allReportText[section].reportText;
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
