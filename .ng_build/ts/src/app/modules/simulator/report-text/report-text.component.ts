import { Component, OnInit, Input , EventEmitter, Output} from '@angular/core';
import { ReportText } from '../shared/models/report-text.model';

@Component({
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
