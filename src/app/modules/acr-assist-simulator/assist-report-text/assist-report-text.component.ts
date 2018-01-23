import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllReportText, MainReportText } from '../assist-data-element/assist-data-element.component';

@Component({
  selector: 'acr-assist-report-text',
  templateUrl: './assist-report-text.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AssistReportTextComponent implements OnInit, OnChanges {
@Input() reportText: MainReportText;

selectedSection: string;
ngOnChanges(changes: SimpleChanges): void {
    this.onSelect(this.reportText.allReportText[0].sectionId);

  }
  constructor() { }

  ngOnInit() {

    this.onSelect(this.reportText.allReportText[0].sectionId);
  }
  onSelect(sectionId) {
    this.selectedSection = null;
    for (let i = 0; i < this.reportText.allReportText.length; i++) {
      if (this.reportText.allReportText[i].sectionId === sectionId) {
        this.selectedSection = this.reportText.allReportText[i].reportText;
        this.selectedSection = this.removeEmptyLine(this.selectedSection);
        break;
      }
    }
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
