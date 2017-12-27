import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css']
})
export class AcrAssistSimulatorComponent implements OnInit , OnChanges {


  @Input() templateContent: string;
  templateContentAsJson: JSON;

  constructor(private templateManagerService: TemplateManagerService) { }

  ngOnInit() {

    this.templateContentAsJson =  this.templateManagerService.parseToJson(this.templateContent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.templateContentAsJson =  this.templateManagerService.parseToJson(this.templateContent);
  }

}
