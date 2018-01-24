import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ImageElements } from '../../../core/elements/models/image-elements.model';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { ChoiceElement } from '../assist-data-element.component';
import { Rules } from '../../../core/rules/models/rules.model';
const $ = require('jquery');
@Component({
  selector: 'acr-assist-choice-element',
  templateUrl: './assist-choice-element.component.html',
  styleUrls: ['./assist-choice-element.component.css', '../../../../modules/styles.css']
})
export class AssistChoiceElementComponent implements OnInit {
  @Input() choiceDataElement: ChoiceDataElement;
  @Input() imagePath: string;
  @Input() Rules: Rules;
  @Input() keyDiagrams: ImageElements[];
  @Output() returnChoiceElement: EventEmitter<ChoiceElement> = new EventEmitter<ChoiceElement>();
  constructor() { }

  ngOnInit() {
    for (let index = 0; index < this.keyDiagrams.length; index++) {
      this.keyDiagrams[index].location =  this.imagePath + '/' + this.keyDiagrams[index].location;
    }
  }
  choiceSelected(elementId: string, selectedValue: string) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = elementId;
    choiceElement.selectedValue = selectedValue;
    this.returnChoiceElement.emit(choiceElement);
  }

  dropdownChoiceSelected(element) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = element.id;
    choiceElement.selectedValue = element.value;
    this.returnChoiceElement.emit(choiceElement);
  }

  hideNonRelevantData(elementId: string, selectedValue: string) {
    for (let index = 0; index < this.Rules.decisionPoints.length; index++) {
      if (this.Rules.decisionPoints[index].branches !== undefined) {
        for (let br = 0; br < this.Rules.decisionPoints[index].branches.length; br++) {
          const text = this.Rules.decisionPoints[index].branches[br].label;
          if (text.toLowerCase() === selectedValue.toLowerCase()) {
             for (let NRD = 0; NRD < this.Rules.decisionPoints[index].branches[br].notRelevantDataElements.dataElementReferences.length; NRD++) {
               $(document.getElementById('div_' + this.Rules.decisionPoints[index].branches[br].notRelevantDataElements.dataElementReferences[NRD].dataElementId)).hide();
              }
             break;
          }
        }
      }
    }
  }
}