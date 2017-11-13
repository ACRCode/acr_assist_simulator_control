import { Component, OnInit, Input , EventEmitter, Output} from '@angular/core';
import { ReportText } from '../shared/models/report-text.model';

@Component({
  selector: 'acr-report-text',
  templateUrl: './report-text.component.html',
  styleUrls: ['./report-text.component.css']
})
export class ReportTextComponent  {

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
}
