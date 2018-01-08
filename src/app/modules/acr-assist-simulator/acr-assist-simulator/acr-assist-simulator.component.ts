import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import {Template} from '../../core/models/template.model';
import { SettingsService } from '../../simulator/shared/services/settings.service';
import { ImageElements } from '../../core/elements/models/image-elements.model';
@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css']
})
export class AcrAssistSimulatorComponent implements  OnChanges {


  @Input() templateContent: string;
  @Input() imagePath: string;

  template: Template;
  isEmptyContent: boolean;
  keyDiagrams: ImageElements[] = [];

  constructor(private templateManagerService: TemplateManagerService) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.template =  this.templateManagerService.getTemplate(this.templateContent);
    this.isEmptyContent =
    this.templateContent === undefined ||
    this.templateContent.length === 0;
    console.log(this.template.metadata.diagrams);
    for (let index = 0; index < this.template.metadata.diagrams.length; index++) {
      const element = new ImageElements();
      element.label = this.template.metadata.diagrams[index].label;
      element.location = this.template.metadata.diagrams[index].location;
      this.keyDiagrams.push(element);
    }
  }

}
