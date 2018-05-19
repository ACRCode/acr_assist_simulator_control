import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { OnChanges, AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {Template} from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';
import { MainReportText, FinalExecutedHistory } from '../assist-data-element/assist-data-element.component';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { Diagram } from '../../core/models/diagram.model';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import { InputData } from '../../core/models/input-data.model';
import { ReportTextPosition } from '../../core/models/report-text.model';
const $ = require('jquery');
declare var reportTextCollapse: any;
declare var keyDiagramCollapse: any;
declare var init_keyImagesUI: any;

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css']
})
export class AcrAssistSimulatorComponent implements  OnChanges, AfterViewInit {
  @Input() templateContent: string;
  @Input() imagePath: string;
  @Input() showKeyDiagram: boolean;
  @Input() reportTextPosition: ReportTextPosition;
  @Input() inputValues: InputData[] = [];
  @Input() inputData: string;
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();
  @Output() returnDefaultElements = new EventEmitter();
  template: Template;
  isEmptyContent: boolean;
  keyDiagrams: Diagram[];
  resultText: MainReportText;
  isReset: boolean;
  dataElements: BaseDataElement[];
  position =  ReportTextPosition;

  constructor(private templateManagerService: TemplateManagerService , private simulatorEngineService: SimulatorEngineService) {
    }

  ngAfterViewInit(): void {
    this.reloadUI();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadUI();
    this.isReset = true;
    this.isEmptyContent =   this.templateContent === undefined || this.templateContent.length === 0 && this.inputValues.length === 0 &&
    this.inputData === undefined ;
    if (this.isEmptyContent) {
      return;
    }
    if (this.inputData !== undefined) {
      if (this.inputData.length > 0) {
        this.inputValues = JSON.parse(this.inputData);
      }
    }

    this.template =  this.templateManagerService.getTemplate(this.templateContent);
    this.simulatorEngineService.initialize(this.template);
    if (this.inputValues.length !== 0) {
      for (const dataeElement of this.template.dataElements) {
        const inputValue = this.inputValues.filter( x => x.dataElementId === dataeElement.id);
        if (inputValue !== undefined && inputValue.length > 0 ) {
          dataeElement.currentValue = inputValue[0].dataElementValue;
        }
      }
    }
    this.dataElements = this.template.dataElements;
    this.keyDiagrams = new Array<Diagram>();

    for (let index = 0; index < this.template.metadata.diagrams.length; index++) {
        const element = new Diagram();
        element.label = this.template.metadata.diagrams[index].label;
        element.location = this.imagePath + '/' + this.template.metadata.diagrams[index].location;
        element.keyDiagram = this.template.metadata.diagrams[index].keyDiagram;
        this.keyDiagrams.push(element);
    }
    this.resultText = undefined;
  }
  resetElements() {
    this.template =  this.templateManagerService.getTemplate(this.templateContent);
    this.simulatorEngineService.initialize(this.template);

    this.dataElements = this.template.dataElements;
    this.resultText = undefined;
    this.returnDefaultElements.emit();
  }


  recieveReportText (textReport: MainReportText) {
    this.resultText = textReport;
  }

  recievedExecutionHistory (finalExecutionHistory: FinalExecutedHistory) {
       this.returnExecutionHistory.emit(finalExecutionHistory);
  }

  changeListener(event): void {
    this.keyDiagrams = new Array<Diagram>();
    for (const image in event.target.files) {
      if (event.target.files.hasOwnProperty(image)) {
        const reader = new FileReader();
        const diagram = new Diagram();
        diagram.label = event.target.files[image].name;
        diagram.keyDiagram = image === '0' ? true : false;
        const imageType = event.target.files[image].imageType;
        const fileStream = event.target.files[image];

        reader.onload = (event1: any) => {
          diagram.location = reader.result;
        };

        reader.readAsDataURL(event.target.files[image]);

        reader.onloadend = (event1: any) => {
          this.keyDiagrams.push(diagram);
          this.reloadUI();
        };
      }
    }
  }

  collapseKeyDiagram() {
    keyDiagramCollapse();
  }

  collapseReportText() {
    reportTextCollapse();
  }

  reloadUI() {
    setTimeout(_ => {
      init_keyImagesUI();
    });
  }
}
