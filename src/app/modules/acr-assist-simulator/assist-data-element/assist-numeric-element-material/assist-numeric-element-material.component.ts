import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { NumericDataElement } from 'testruleengine/Library/Models/Class';
import { NumericElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { SimulatorCommunicationService } from '../../shared/services/simulator-communication.service';
import { Subscription } from 'rxjs';
import { ResetCommunicationService } from '../../shared/services/reset-communication.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'acr-assist-numeric-element-material',
  templateUrl: './assist-numeric-element-material.component.html',
  styleUrls: ['./assist-numeric-element-material.component.css', '../../styles.css']
})
export class AssistNumericElementMaterialComponent implements OnInit, AfterViewInit, OnDestroy {

  numericElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  subscription: Subscription;
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() assetsBaseUrl: string;
  @Input() numericDataElement: NumericDataElement;
  @Output() returnNumericElement = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private simulatorEngineService: SimulatorEngineService,
    private utilityService: UtilityService,
    simulatorCommunicationService: SimulatorCommunicationService,
    resetCommunicationService: ResetCommunicationService) {
    this.subscription = simulatorCommunicationService.simulatorSource$.subscribe(
      mission => {
        this.updateFormValidator();
      });

    this.subscription = resetCommunicationService.resetSource$.subscribe(
      mission => {

      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  _keyUp(event: any) {
    // const $this = this;
    // if ($this.numericDataElement.maximum != undefined && parseFloat(value) > $this.numericDataElement.maximum) {
    //   event.preventDefault();
    //   if (value.toString().substring(0, value.toString().length - 1) == '') {
    //     $this.numberValue = undefined;
    //   } else {
    //     $this.numberValue = parseFloat(value.toString().substring(0, value.toString().length - 1));
    //   }
    // }
  }

  _keyUpInteger(event: any) {
    // const $this = this;
    // if ($this.numericDataElement.maximum != undefined && parseInt(value) > $this.numericDataElement.maximum) {
    //   event.preventDefault();
    //   if (value.toString().substring(0, value.toString().length - 1) == '') {
    //     $this.numberValue = undefined;
    //   } else {
    //     $this.numberValue = parseInt(value.toString().substring(0, value.toString().length - 1));
    //   }
    // }
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

  updateFormValidator() {
    if (this.numericDataElement.isRequired) {
      this.numericElementForm.controls.numericElement.setValidators([Validators.compose([Validators.required,
      Validators.min(+this.numericDataElement.minimum), Validators.max(+this.numericDataElement.maximum)])]);
      this.numericElementForm.controls.numericElement.updateValueAndValidity();
    } else {
      this.numericElementForm.controls.numericElement.setValidators([Validators.compose([
      Validators.min(+this.numericDataElement.minimum), Validators.max(+this.numericDataElement.maximum)])]);
      this.numericElementForm.controls.numericElement.updateValueAndValidity();
    }
  }

  private createNumericElementForm() {
    if (this.numericDataElement.isRequired) {
      this.numericElementForm = this.formBuilder.group({
        // tslint:disable-next-line:max-line-length
        numericElement: ['', Validators.compose([Validators.required, Validators.min(+this.numericDataElement.minimum), Validators.max(+this.numericDataElement.maximum)])],
      });
    } else {
      this.numericElementForm = this.formBuilder.group({
        // tslint:disable-next-line:max-line-length
        numericElement: ['', Validators.compose([Validators.min(+this.numericDataElement.minimum), Validators.max(+this.numericDataElement.maximum)])],
      });
    }
  }
}
