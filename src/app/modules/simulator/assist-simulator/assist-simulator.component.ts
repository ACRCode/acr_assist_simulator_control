import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { Metadata } from '../shared/models/metadata.model';
import { Parser } from '../shared/utils/parser';
import { TemplateDetails } from '../shared/models/template-details.model';
import { XMLUtil } from '../shared/utils/XMLUtil';

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './assist-simulator.component.html',
  styleUrls: ['./assist-simulator.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class AssistSimulatorComponent implements OnInit , OnChanges {

   @Input() templateContent: string;
   @Input() imagePath: string;



  errorMessage: string;
  ErrorCode: number;
  FormValues: Object;
  ExpressionBlocks: ExpressionBlock[];
  isValid: boolean;
  DataElements: DataElement[];
  FormChanged: boolean;
  BaseFormValues: Object;
  ValidationBlocks;
  DataElementObj;
  Metadata: Metadata;


  constructor(
    private globalsService: GlobalsService,
      private cd: ChangeDetectorRef

  ) {


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processData();
  }

  ngOnInit() {
    this.processData();

  }


  resetData() {

    this.FormValues = {};
    this.BaseFormValues = {};
    this.ExpressionBlocks = [];
    this.DataElements = [];
    this.ValidationBlocks = [];
    this.DataElementObj = {};

    this.globalsService.XMLAcronyms = {};
    this.ExpressionBlocks = [];
    this.DataElements = [];
    this.Metadata = undefined;
    this.FormValues = {};
    this.ValidationBlocks = [];
    this.globalsService.evaluateExpessions = true;
    this.globalsService.ComputedElementConditions = {};
    this.globalsService.XMLAcronyms = {};

  }

  processData() {

      this.resetData();
      this.isValid = this.templateContent.length > 0 && this.imagePath.length  > 0;

      const templateDetails = new TemplateDetails ();
      templateDetails.imagePath = this.imagePath;
      templateDetails.templateContent = this.templateContent;
      const util = new XMLUtil();
      util.load(templateDetails);

      this.globalsService.XMLAcronyms  = util.Acronyms;
      this.Metadata = util.Metadata;
      this.DataElements = util.DataElements;
      this.ExpressionBlocks = util.ExpressionBlocks;
      this.ValidationBlocks = util.ValidationBlocks;
      this.FormValues = util.FormValues;
      this.BaseFormValues = JSON.parse(JSON.stringify(this.FormValues));

    }
  displayDataElements(notRelevantDataElments) {

     this.DataElements.forEach(de => {
         const deindex = this.DataElements.indexOf(de);
         if (notRelevantDataElments !== undefined && notRelevantDataElments.indexOf(deindex) !== -1) {
             de.Visible = false;
         } else {
             de.Visible = true;
         }
     });
     this.globalsService.evaluateExpessions = false;
     this.cd.detectChanges();
     this.globalsService.evaluateExpessions = true;
 }
}
