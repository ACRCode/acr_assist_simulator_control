import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import {Template} from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';
import { MainReportText, FinalExecutedHistory } from '../assist-data-element/assist-data-element.component';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { Diagram } from '../../core/models/diagram.model';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AcrAssistSimulatorComponent implements  OnChanges {


  @Input() templateContent: string;
  @Input() imagePath: string;
  @Input() showKeyDiagram: boolean;
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();

  template: Template;
  isEmptyContent: boolean;
  keyDiagram: Diagram;
  resultText: MainReportText;
  constructor(private templateManagerService: TemplateManagerService , private simulatorEngineService: SimulatorEngineService) {

   }

  ngOnChanges(changes: SimpleChanges): void {

    this.isEmptyContent =  this.templateContent === undefined || this.templateContent.length === 0;
    if (this.isEmptyContent) {
      return;
    }

    this.template =  this.templateManagerService.getTemplate(this.templateContent);
    console.log(this.template);
    this.simulatorEngineService.initialize(this.template);

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

  resetElements () {
    const resetDataElement: BaseDataElement[] = new Array<BaseDataElement>();
    this.template =  this.templateManagerService.getTemplate(this.templateContent);
    for (const dataElement of  this.template.dataElements) {
      dataElement.currentValue = dataElement.defaultValue;
      resetDataElement.push(dataElement);
   }
   this.template.dataElements = resetDataElement;
   this.simulatorEngineService.resetAllDataElementValues();
    this.resultText = undefined;
  }

  recieveReportText (textReport: MainReportText) {
    this.resultText = textReport;
  }

  recievedExecutionHistory (finalExecutionHistory: FinalExecutedHistory) {
       this.returnExecutionHistory.emit(finalExecutionHistory);
  }
}
