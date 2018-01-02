import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import {Template} from '../../core/models/template.model';
@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css']
})
export class AcrAssistSimulatorComponent implements  OnChanges {


  @Input() templateContent: string;
  template: Template;

  constructor(private templateManagerService: TemplateManagerService) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.template =  this.templateManagerService.getTemplate(this.templateContent);
    console.log(this.template);
  }

}
