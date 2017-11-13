import { Component, OnInit , Input, AfterViewInit } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { EndPoint } from '../shared/models/endpoint.model';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-expression-result',
  templateUrl: './expression-result.component.html',
  styleUrls: ['./expression-result.component.css']
})
export class ExpressionResultComponent  implements OnInit {


      @Input() ExpBlock: ExpressionBlock;
      @Input() Result: EndPoint;
      @Input() FormValues: Object = {};
      @Input() DataElements: DataElement[] = [];
      sectionResult = '';
      selectedSection = '';
      result: string;

      ngOnInit()  {
          if (this.Result.ReportSections.length > 0) {
              this.selectedSection = this.Result.ReportSections[0].Heading;
          }
       }

      getResultText() {
          const res = {};
          for (const section of this.Result.ReportSections) {
              const sectionResult = this.generateSectionResult(section);
              res[sectionResult.Heading] = sectionResult.ReportText;
          }
          return res;
      }

      generateSectionResult(reportSection) {
           const reportText = this.textifyReportText(reportSection.ReportTexts);
           return { 'Heading': reportSection.Heading, 'ReportText': reportText };

      }
      textifyReportText(reportTexts) {
          let res = '';
          for (const reportText of reportTexts) {
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

      evaluate(cond) {
          if (cond === '') {
              return false;
          }
          const res = eval(cond);
          return res;
      }

}
