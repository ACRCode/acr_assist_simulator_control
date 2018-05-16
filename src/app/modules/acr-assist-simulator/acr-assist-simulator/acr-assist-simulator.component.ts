import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import {Template} from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';
import { MainReportText, FinalExecutedHistory } from '../assist-data-element/assist-data-element.component';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { Diagram } from '../../core/models/diagram.model';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import { InputData } from '../../core/models/input-data.model';
import { ReportTextPosition } from '../../core/models/report-text.model';

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AcrAssistSimulatorComponent implements  OnChanges {

  @Input() templateContent: string;
  @Input() imagePath: string;
  @Input() showKeyDiagram: boolean;
  @Input() reportTextPosition: string;
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();
  @Output() returnDefaultElements = new EventEmitter();
  template: Template;
  isEmptyContent: boolean;
  keyDiagram: Diagram;
  resultText: MainReportText;
  @Input() inputValues: InputData[] = [];
  @Input() inputData: string;
  isReset: boolean;
  dataElements: BaseDataElement[];
  position =  ReportTextPosition;
  constructor(private templateManagerService: TemplateManagerService , private simulatorEngineService: SimulatorEngineService) {
    }

  ngOnChanges(changes: SimpleChanges): void {
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

    for (let index = 0; index < this.template.metadata.diagrams.length; index++) {
      if (this.template.metadata.diagrams[index].keyDiagram) {
        const element = new Diagram();
        element.label = this.template.metadata.diagrams[index].label;
        element.location = this.imagePath + '/' + this.template.metadata.diagrams[index].location;
        element.keyDiagram = this.template.metadata.diagrams[index].keyDiagram;
        this.keyDiagram = element;
        break;
      }
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
}
