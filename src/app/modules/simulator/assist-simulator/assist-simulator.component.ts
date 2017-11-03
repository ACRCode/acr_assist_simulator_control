import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { Metadata } from '../shared/models/metadata.model';
import { Parser } from '../shared/utils/parser';

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './assist-simulator.component.html',
  styleUrls: ['./assist-simulator.component.css']
})
export class AssistSimulatorComponent implements OnInit {
  @Input() xmlTemplate: string;
  errorMessage: string;
  ErrorCode: number;
  selectedXML: string;
  xmlTemplateAsJSON: any;
  FormValues: Object;
  ExpressionBlocks: ExpressionBlock[];
  isValid: string = null;
  DataElements: DataElement[];
  FormChanged: boolean;
  BaseFormValues: Object;
  ValidationBlocks;
  DataElementObj;
  Metadata: Metadata;

  constructor(
    private globalsService: GlobalsService,
    private ref: ChangeDetectorRef
  ) {
    this.ref.markForCheck();
    this.FormValues = {};
    this.BaseFormValues = {};
    this.ExpressionBlocks = [];
    this.DataElements = [];
    this.ValidationBlocks = [];
    this.DataElementObj = {};
  }

  ngOnInit() {
    this.globalsService.SelectedXMLFile = this.xmlTemplate;
    this.globalsService.ExecutedConditionsIndexes = {};
    this.globalsService.ComputedElementConditions = {};
    this.globalsService.XMLAcronyms = {};
    this.ExpressionBlocks = [];
    this.DataElements = [];
    this.Metadata = undefined;
    this.FormValues = {};
    this.ValidationBlocks = [];
    this.processData();
  }

  processData() {
    // TODO :- add the xmllint for validation

    const parser = new Parser();
    if (!parser.IsJsonString(this.xmlTemplate)) {
      this.xmlTemplateAsJSON = parser.parseToJson(
        this.xmlTemplate
      );
      console.log (this.xmlTemplateAsJSON);
    }

  }



}
