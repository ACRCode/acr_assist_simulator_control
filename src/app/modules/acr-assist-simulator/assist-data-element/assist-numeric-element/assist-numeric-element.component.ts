import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NumericDataElement } from 'testruleengine/Library/Models/Class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { UtilityService } from '../../../core/services/utility.service';
import { NumericElement } from '../model/data.model';
declare var triggerToolTip: any;

@Component({
  selector: 'acr-assist-numeric-element',
  templateUrl: './assist-numeric-element.component.html',
  styleUrls: ['./assist-numeric-element.component.css', '../../styles.css']
})
export class AssistNumericElementComponent implements OnInit, AfterViewInit {

  numericElementForm: FormGroup;
  selectedCondition: SelectedCondition;

  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() assetsBaseUrl: string;
  @Input() numericDataElement: NumericDataElement;
  @Output() returnNumericElement = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private simulatorEngineService: SimulatorEngineService,
    public utilityService: UtilityService) {
  }

  ngOnInit() {
    this.createNumericElementForm();
  }

  ngAfterViewInit(): void {
    if (this.numericDataElement.currentValue !== undefined && this.numericDataElement.currentValue !== 0) {
      this.simulatorEngineService.addOrUpdateDataElement(this.numericDataElement.id, this.numericDataElement.currentValue,
        this.numericDataElement.currentValue);
      this.numericElementForm.controls.numericElement.setValue(this.numericDataElement.currentValue);
      this.loadedNumericValue(this.numericDataElement.id, this.numericDataElement.currentValue, this.numericDataElement.label);
    } else {
      this.returnNumericElement.emit(undefined);
    }

    triggerToolTip();
  }

  loadedNumericValue(id, value, selectedCondition) {
    const choiceElement = new NumericElement();
    choiceElement.elementId = id;
    choiceElement.selectedValue = value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = value;
    this.returnNumericElement.emit({ receivedElement: choiceElement, selectedCondition: this.selectedCondition });
  }

  choiceSelected(element, selectedCondition) {
    const choiceElement = new NumericElement();
    choiceElement.elementId = element.id;
    choiceElement.selectedValue = element.value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = element.id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = element.value;

    this.returnNumericElement.emit({ receivedElement: choiceElement, selectedCondition: this.selectedCondition });
  }

  onlyIntegerKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  hasAIInputStyle() {
    if (this.utilityService.isNotEmptyArray(this.numericDataElement.sources)) {
      const elem = this.numericDataElement.sources.find(x => x.id === this.numericDataElement.id);
      if (this.utilityService.isValidInstance(elem)) {
        return elem.value === this.numericElementForm.controls.numericElement.value;
      }
    }

    return false;
  }

  isNumericElementRequired(): boolean {
    return this.numericElementForm.controls.numericElement.invalid &&
           this.numericElementForm.controls.numericElement.errors.required &&
           this.numericDataElement.isRequired;
  }

  isNumericElementMin(): boolean {
    return this.numericElementForm.controls.numericElement.invalid &&
           this.numericElementForm.controls.numericElement.errors.min;
  }

  isNumericElementMax(): boolean {
    return this.numericElementForm.controls.numericElement.invalid &&
           this.numericElementForm.controls.numericElement.errors.max;
  }

  private createNumericElementForm() {
    this.numericElementForm = this.formBuilder.group({
      numericElement: ['', Validators.compose
        ([
          Validators.required,
          Validators.min(+this.numericDataElement.minimum),
          Validators.max(+this.numericDataElement.maximum)
        ])],
    });
  }
}
