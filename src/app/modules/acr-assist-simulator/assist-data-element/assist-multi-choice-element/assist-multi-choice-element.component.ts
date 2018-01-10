import { Component, OnInit, Input } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { MultiChoiceDataElement } from '../../../core/elements/models/multi-choice-data-element';

@Component({
  selector: 'acr-assist-multi-choice-element',
  templateUrl: './assist-multi-choice-element.component.html',
  styleUrls: ['../../../../modules/styles.css']
})
export class AssistMultiChoiceElementComponent implements OnInit {
  @Input() multiChoiceElement: MultiChoiceDataElement;
  @Input() imagePath: string;

  constructor() { }

  ngOnInit() {
  }

}
