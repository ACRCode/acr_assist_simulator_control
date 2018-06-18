import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';
import { NumericElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
const $ = require('jquery');

@Component({
  selector: 'acr-assist-numeric-element',
  templateUrl: './assist-numeric-element.component.html',
  styleUrls: ['./assist-numeric-element.component.css', '../../styles.css']
})
export class AssistNumericElementComponent implements OnInit, AfterViewInit {

  @Input() numericDataElement: NumericDataElement;
  @Input() imagePath: string;
  @Output() returnNumericElement = new EventEmitter();
  numericElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  numberValue: number;
  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService) {
   }

  ngOnInit() {
    this.createNumericElementForm();
  }

  ngAfterViewInit(): void {
    if (this.numericDataElement.currentValue !== undefined && this.numericDataElement.currentValue !== 0) {
      this.numberValue = this.numericDataElement.currentValue;
        this.loadedNumericValue(this.numericDataElement.id, this.numericDataElement.currentValue, this.numericDataElement.label);
    }
  }
  loadedNumericValue(id, value, selectedCondition) {
    const choiceElement = new NumericElement ();
    choiceElement.elementId = id;
    choiceElement.selectedValue = value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = value;
    this.returnNumericElement.emit({receivedElement: choiceElement, selectedCondition: this.selectedCondition});
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
