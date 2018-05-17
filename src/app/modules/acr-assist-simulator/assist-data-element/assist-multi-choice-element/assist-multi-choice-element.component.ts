import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { MultiChoiceDataElement } from '../../../core/elements/models/multi-choice-data-element';
import { MultiChoiceElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
const $ = require('jquery');

@Component({
  selector: 'acr-assist-multi-choice-element',
  templateUrl: './assist-multi-choice-element.component.html',
  styleUrls: ['./assist-multi-choice-element.component.css']
})
export class AssistMultiChoiceElementComponent implements OnInit, AfterViewInit {
  @Input() multiChoiceElement: MultiChoiceDataElement;
  @Input() imagePath: string;
  @Output() returnMultiChoice = new EventEmitter();
  multiElements: MultiChoiceElement [] = [];
  multiChoiceValues: string[] = [];
  multiChoiceComaprisonValues: string[] = [];
  multiChoiceElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  choiceValue: string[] = [];
  checked: string;
  selctValue: string;
  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService) {}

  ngOnInit() {
    this.createMultiChoiceElementForm();
  }
  ngAfterViewInit(): void {

    if (this.multiChoiceElement.currentValue !== undefined) {
      for (const choice in this.multiChoiceElement.choiceInfo) {
        if (Array.isArray( this.multiChoiceElement.currentValue)) {
          for (const currValue of this.multiChoiceElement.currentValue) {
            // this.choiceValue = this.multiChoiceElement.currentValue;
            if (currValue === this.multiChoiceElement.choiceInfo[choice].value && this.multiChoiceElement.choiceInfo[choice].value !== undefined) {
              this.choiceValue = this.multiChoiceElement.currentValue;
              this.simulatorEngineService.addOrUpdateDataElement( this.multiChoiceElement.id, this.multiChoiceElement.currentValue,
                this.multiChoiceElement.choiceInfo[choice].label);
              const customEvent = document.createEvent('Event');
              $('#' + this.multiChoiceElement.id + '_' + this.multiChoiceElement.currentValue[choice]).prop('checked', true);
              customEvent.initEvent('change', true, true);
              this.selctValue = currValue;
              this.selectedMultiChoice(this.multiChoiceElement.id, this.multiChoiceElement.label, currValue, this.multiChoiceElement.currentValue[choice].label);
              break;
            }
          }
        } else {
          if (this.multiChoiceElement.currentValue === this.multiChoiceElement.choiceInfo[choice].value && this.multiChoiceElement.choiceInfo[choice].value !== undefined) {
                // this.checked = true;
                this.simulatorEngineService.addOrUpdateDataElement( this.multiChoiceElement.id, this.multiChoiceElement.currentValue,
                  this.multiChoiceElement.choiceInfo[choice].label);
                this.choiceValue = this.multiChoiceElement.currentValue;
                const customEvent = document.createEvent('Event');
              $('#' + this.multiChoiceElement.id + '_' + this.multiChoiceElement.currentValue).prop('checked', true);
              customEvent.initEvent('change', true, true);
              this.selectedMultiChoice(this.multiChoiceElement.id, this.multiChoiceElement.label, this.multiChoiceElement.currentValue, this.multiChoiceElement.currentValue[choice].label);
          }
        }
        if (this.selctValue === this.multiChoiceElement.choiceInfo[choice].value) {
          this.checked = this.multiChoiceElement.choiceInfo[choice].value;
        } else {
          this.checked = undefined;
        }
      }
    }
  }
  selectedMultiChoice(elementId: string, selectedCondition: string, choiceValue: string, choiceLabel) {
    const multiElement = new MultiChoiceElement();
    if ($('#' + elementId + '_' + choiceValue).is(':checked')) {
      this.multiChoiceValues.push(choiceLabel);
      this.multiChoiceComaprisonValues.push(choiceValue);
      this.checked = choiceValue;
      if (this.selctValue === choiceValue) {
        this.checked = choiceValue;
      } else {
        this.checked = undefined;
      }
    } else {
      const index = this.multiChoiceValues.indexOf(choiceLabel);
      this.checked = undefined;
      const comparisonIndex = this.multiChoiceComaprisonValues.indexOf(choiceValue);
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
  }
  updateMultiChoice(elementId: string, selectedCondition: string, value: string, event) {
    const multiElement = new MultiChoiceElement();
    if (event.currentTarget.checked) {
      this.multiChoiceValues.push(value);
      this.multiChoiceComaprisonValues.push(event.currentTarget.value);
      this.checked = event.currentTarget.value;
      if (this.selctValue === event.currentTarget.value) {
        this.checked = event.currentTarget.value;
      } else {
        this.checked = undefined;
      }
    } else {
      const index = this.multiChoiceValues.indexOf(value);
      this.checked = undefined;
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
      multiCheckBox: ['', Validators.required ],
    }, {
      validator: this.specificValueInsideRange('multiCheckBox')
    });
  }

  private specificValueInsideRange(checkBoxKey: string) {
    return (group: FormGroup) => {
      const choiceControl = group.controls[checkBoxKey];
      if ( this.multiChoiceElement.isRequired ) {
        return choiceControl.setErrors({ notEquivalent: true });
      }else {
        return choiceControl.setErrors(null);
      }
    };
  }
}
