import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { MultiChoiceDataElement } from '../../../core/elements/models/multi-choice-data-element';
import { MultiChoiceElement } from '../assist-data-element.component';

@Component({
  selector: 'acr-assist-multi-choice-element',
  templateUrl: './assist-multi-choice-element.component.html',
  styleUrls: ['../../../../modules/styles.css']
})
export class AssistMultiChoiceElementComponent implements OnInit {
  @Input() multiChoiceElement: MultiChoiceDataElement;
  @Input() imagePath: string;
  @Output() returnMultiChoice: EventEmitter<MultiChoiceElement> = new EventEmitter<MultiChoiceElement> ();
  multiElements: MultiChoiceElement [] = [];
  multiChoiceValues: string[] = [];
  constructor() { }

  ngOnInit() {
  }

  updateMultiChoice(elementId: string, value: string, event) {
    const multiElement = new MultiChoiceElement();
    if (event.currentTarget.checked) {
      this.multiChoiceValues.push(value);
    } else {
      const index = this.multiChoiceValues.indexOf(value);
      if (index > -1) {
        this.multiChoiceValues.splice(index, 1);
      }
    }
     multiElement.elementId = elementId;
    multiElement.selectedValues = this.multiChoiceValues;
    this.returnMultiChoice.emit(multiElement);
  }

}
