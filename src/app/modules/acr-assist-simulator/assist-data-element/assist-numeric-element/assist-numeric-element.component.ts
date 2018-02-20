import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';
import { NumericElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';

@Component({
  selector: 'acr-assist-numeric-element',
  templateUrl: './assist-numeric-element.component.html',
  styleUrls: ['../../../../modules/styles.css']
})
export class AssistNumericElementComponent implements OnInit {
  @Input() numericDataElement: NumericDataElement;
  @Input() imagePath: string;
  @Output() returnNumericElement = new EventEmitter();
  numericElementForm: FormGroup;
  selectedCondition: SelectedCondition;

  constructor(private formBuilder: FormBuilder) {
   }

  ngOnInit() {
    this.createNumericElementForm();
  }
  choiceSelected(element, selectedCondition) {
    const choiceElement = new NumericElement ();
    choiceElement.elementId = element.id;
    choiceElement.selectedValue = element.value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = element.id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = element.value;
    this.returnNumericElement.emit({receivedElement: choiceElement, selectedCondition: this.selectedCondition});
  }

  private createNumericElementForm() {
    this.numericElementForm = this.formBuilder.group({
      numericElement: ['', Validators.compose([Validators.required, Validators.min(+this.numericDataElement.minimum)])],
    });
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
}
