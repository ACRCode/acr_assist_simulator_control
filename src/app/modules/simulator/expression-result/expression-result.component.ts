import { Component, OnInit , Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { EndPoint } from '../shared/models/endpoint.model';
import { DataElement } from '../shared/models/data-element.model';
import { ExecutedResults } from '../shared/models/executed-results.model';

@Component({
  selector: 'acr-expression-result',
  templateUrl: './expression-result.component.html',
  styleUrls: ['../../styles.css']
})
export class ExpressionResultComponent  implements OnInit {


      @Input() ExpBlock: ExpressionBlock;
      @Input() Result: EndPoint;
      @Input() FormValues: Object = {};
      @Input() DataElements: DataElement[] = [];
      @Output() onValueChanged = new EventEmitter<ExecutedResults>();
      DataElementObj: {};
      sectionResult = '';
      selectedSection = '';
      result: string;
      executedResults= new ExecutedResults();
      constructor(private globalsService: GlobalsService) {

   }
      ngOnInit()  {
          this.DataElementObj = {};
        this.DataElements.forEach(de => {
           
            this.DataElementObj[de.ID] = de;
        });
          if (this.Result !== undefined && this.Result.ReportSections.length > 0) {
              this.selectedSection = this.Result.ReportSections[0].Heading;

              let reportSections = this.getResultText();
              let formData = {};
            for (let key in this.FormValues) {

                if (this.DataElementObj[key] != undefined && (this.DataElementObj[key].hasOwnProperty("Visible") && this.DataElementObj[key].Visible)
                    && (!this.DataElementObj[key].hasOwnProperty("ShowValue") || (this.DataElementObj[key].ShowValue))) {

                    formData[this.globalsService.XMLAcronyms[key]] = this.globalsService.XMLAcronyms[this.FormValues[key]] == undefined ? this.FormValues[key] : this.globalsService.XMLAcronyms[this.FormValues[key]];
                }
            }
            let block = JSON.parse(JSON.stringify(this.ExpBlock));
            this.executedResults.reportSections = reportSections;
            this.executedResults.block = block;
            this.executedResults.formData = formData;
            if(this.executedResults != undefined)
            {
                this.onValueChanged.emit(this.executedResults);
            }
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
