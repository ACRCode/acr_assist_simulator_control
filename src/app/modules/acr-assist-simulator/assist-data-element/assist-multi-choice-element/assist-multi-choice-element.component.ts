import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { MultiChoiceDataElement } from '../../../core/elements/models/multi-choice-data-element';
import { MultiChoiceElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';

@Component({
  selector: 'acr-assist-multi-choice-element',
  templateUrl: './assist-multi-choice-element.component.html',
  styleUrls: ['../../../../modules/styles.css']
})
export class AssistMultiChoiceElementComponent implements OnInit {
  @Input() multiChoiceElement: MultiChoiceDataElement;
  @Input() imagePath: string;
  @Output() returnMultiChoice = new EventEmitter();
  multiElements: MultiChoiceElement [] = [];
  multiChoiceValues: string[] = [];
  multiChoiceComaprisonValues: string[] = [];
  multiChoiceElementForm: FormGroup;
  selectedCondition: SelectedCondition;

  constructor(private formBuilder: FormBuilder) {
    this.createMultiChoiceElementForm();
  }
  ngOnInit() {
  }

  updateMultiChoice(elementId: string, selectedCondition: string, value: string, event) {
    const multiElement = new MultiChoiceElement();
    if (event.currentTarget.checked) {
      this.multiChoiceValues.push(value);
      this.multiChoiceComaprisonValues.push(event.currentTarget.value);
    } else {
      const index = this.multiChoiceValues.indexOf(value);
      const comparisonIndex = this.multiChoiceComaprisonValues.indexOf(event.currentTarget.value);
      if (index > -1) {
        this.multiChoiceValues.splice(index, 1);
      }
      if (comparisonIndex > -1) {
        this.multiChoiceComaprisonValues.splice(comparisonIndex, 1);
      }
    }
     multiElement.elementId = elementId;
    multiElement.selectedValues = this.multiChoiceValues;
    multiElement.selectedComparisonValues = this.multiChoiceComaprisonValues;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = this.multiChoiceValues;
    this.returnMultiChoice.emit({receivedElement: multiElement, selectedCondition: this.selectedCondition});
    // this.returnMultiChoice.emit(multiElement);
  }

  private createMultiChoiceElementForm() {
    this.multiChoiceElementForm = this.formBuilder.group({
      checkBox: ['', Validators.required ],
    });
  }

}
