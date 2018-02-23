import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ImageElements } from '../../../core/elements/models/image-elements.model';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { ChoiceElement } from '../assist-data-element.component';
import { SelectedCondition } from '../../../core/models/executed-result.model';
const $ = require('jquery');
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'acr-assist-choice-element',
  templateUrl: './assist-choice-element.component.html',
  styleUrls: ['./assist-choice-element.component.css', '../../../../modules/styles.css']
})
export class AssistChoiceElementComponent implements OnInit, AfterViewInit {
  @Input() choiceDataElement: ChoiceDataElement;
  @Input() imagePath: string;
  @Output() returnChoiceElement = new EventEmitter();
  choiceElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.createChoiceElementForm();
  }

  ngAfterViewInit(): void {
    $('#div_' + this.choiceDataElement.id + '_other').hide();
  }
  choiceSelected(elementId: string, selectedElement: string, selectedText: string, selectedValue: string) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = elementId;
    choiceElement.selectedValue = selectedValue;
    choiceElement.selectedText = selectedText;
    this.showOrHideFreeText(elementId, choiceElement.selectedValue);

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedElement;
    this.selectedCondition.selectedValue = selectedText;

this.returnChoiceElement.emit({receivedElement: choiceElement, selectedCondition: this.selectedCondition});
  }

  dropdownChoiceSelected(element, selectedCondition) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = element.id;
    choiceElement.selectedValue = (element.selectedOptions[0].label === 'Other') ? 'other' : element.value;
    choiceElement.selectedText = element.selectedOptions[0].label;
    this.showOrHideFreeText(element.id, choiceElement.selectedValue);
    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = element.id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = element.selectedOptions[0].label;
    this.returnChoiceElement.emit({receivedElement: choiceElement, selectedCondition: this.selectedCondition});
   }

  private createChoiceElementForm() {
    this.choiceElementForm = this.formBuilder.group({
      checkBox: ['', Validators.required],
    }, {
      validator: this.specificValueInsideRange('checkBox')
    });
  }

  showOrHideFreeText (elementId: string, selectedValue: string) {
    if (selectedValue === 'other') {
      $('#div_' + elementId + '_other').show();
    } else {
      $('#div_' + elementId + '_other').hide();
    }
  }

  updateFreeText (element, elementId, selectedCondition) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = elementId;
    choiceElement.selectedValue = (element.value === 'Other') ? 'other' : element.value;
    choiceElement.selectedText = element.value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = element.value;
    this.returnChoiceElement.emit({receivedElement: choiceElement, selectedCondition: this.selectedCondition});
  }
  private specificValueInsideRange(checkBoxKey: string) {
    return (group: FormGroup) => {
      const choiceControl = group.controls[checkBoxKey];
      if ((choiceControl.value === 'undefined' || choiceControl.value === '') && this.choiceDataElement.isRequired ) {
        return choiceControl.setErrors({ notEquivalent: true });
      }else {
        return choiceControl.setErrors(null);
      }
    };
  }
}
