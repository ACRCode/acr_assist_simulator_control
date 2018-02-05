import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';
import { NumericElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'acr-assist-numeric-element',
  templateUrl: './assist-numeric-element.component.html',
  styleUrls: ['../../../../modules/styles.css']
})
export class AssistNumericElementComponent implements OnInit {
  @Input() numericDataElement: NumericDataElement;
  @Input() imagePath: string;
  @Output() returnNumericElement: EventEmitter<NumericElement> = new EventEmitter<NumericElement>();
  numericElementForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
   }

  ngOnInit() {
    this.createNumericElementForm();
  }
  choiceSelected(element) {
    const choiceElement = new NumericElement ();
    choiceElement.elementId = element.id;
    choiceElement.selectedValue = element.value;
    this.returnNumericElement.emit(choiceElement);
  }

  private createNumericElementForm() {
    this.numericElementForm = this.formBuilder.group({
      numericElement: ['', Validators.compose([Validators.required, Validators.min(+this.numericDataElement.minimum)])],
    });
  }
}
