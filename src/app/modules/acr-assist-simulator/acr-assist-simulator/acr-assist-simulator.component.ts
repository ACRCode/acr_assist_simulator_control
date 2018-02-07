import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import {Template} from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';
import { MainReportText, FinalExecutedHistory } from '../assist-data-element/assist-data-element.component';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css']
})
export class AcrAssistSimulatorComponent implements  OnChanges {


  @Input() templateContent: string;
  @Input() imagePath: string;
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();

  template: Template;
  isEmptyContent: boolean;
  keyDiagrams: ImageElements[] = [];
  resultText: MainReportText;
  constructor(private templateManagerService: TemplateManagerService , private simulatorEngineService: SimulatorEngineService) {

   }



  ngOnChanges(changes: SimpleChanges): void {

    this.isEmptyContent =  this.templateContent === undefined || this.templateContent.length === 0;
    if (this.isEmptyContent) {
      return;
    }

    this.template =  this.templateManagerService.getTemplate(this.templateContent);
    this.simulatorEngineService.initialize(this.template);

    for (let index = 0; index < this.template.metadata.diagrams.length; index++) {
      const element = new ImageElements();
      element.label = this.template.metadata.diagrams[index].label;
      element.location = this.template.metadata.diagrams[index].location;
      this.keyDiagrams.push(element);
    }
    this.resultText = undefined;
  }
  recieveReportText (textReport: MainReportText) {
    this.resultText = textReport;
  }

  recievedExecutionHistory (finalExecutionHistory: FinalExecutedHistory) {
       this.returnExecutionHistory.emit(finalExecutionHistory);
  }
}
