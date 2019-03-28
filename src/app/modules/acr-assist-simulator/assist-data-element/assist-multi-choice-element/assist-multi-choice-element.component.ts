import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MultiChoiceDataElement } from '../../../core/elements/models/multi-choice-data-element';
import { MultiChoiceElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
const $ = require('jquery');
import * as _ from 'lodash';
import { Choice } from '../../../core/elements/models/choice.model';

@Component({
  selector: 'acr-assist-multi-choice-element',
  templateUrl: './assist-multi-choice-element.component.html',
  styleUrls: ['./assist-multi-choice-element.component.css', '../../styles.css']
})
export class AssistMultiChoiceElementComponent implements OnInit, AfterViewInit {
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() multiChoiceElement : MultiChoiceDataElement;
  @Input() imagePath: string;
  @Output() returnMultiChoice = new EventEmitter();
  multiElements: MultiChoiceElement[] = [];
  multiChoiceValues: string[] = [];
  multiChoiceComaprisonValues: string[] = [];
  multiChoiceElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  choiceValue: string[] = [];
  isFreeText = false;
  freeTextValue: string;

  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService) { }

  ngOnInit() {
    this.createMultiChoiceElementForm();
  }
  ngAfterViewInit(): void {
    this.showOrHideFreeText(this.multiChoiceElement.id, '', false);
    if (this.multiChoiceElement.currentValue !== undefined) {
      const values: any = [];
      const labels: any = [];
      for (const choice in this.multiChoiceElement.choiceInfo) {
        if (Array.isArray(this.multiChoiceElement.currentValue)) {
          for (const currValue of this.multiChoiceElement.currentValue) {
            if (currValue === this.multiChoiceElement.choiceInfo[choice].value && this.multiChoiceElement.choiceInfo[choice].value !== undefined) {
              this.choiceValue = this.multiChoiceElement.currentValue;
              $('#' + this.multiChoiceElement.id + '_' + this.multiChoiceElement.choiceInfo[choice].value).prop('checked', true);
              values.push(currValue);
              labels.push(this.multiChoiceElement.choiceInfo[choice].label);
              break;
            }
          }
        } else {
          if (this.multiChoiceElement.currentValue === this.multiChoiceElement.choiceInfo[choice].value && this.multiChoiceElement.choiceInfo[choice].value !== undefined) {
            this.choiceValue = this.multiChoiceElement.currentValue;
            $('#' + this.multiChoiceElement.id + '_' + this.multiChoiceElement.currentValue).prop('checked', true);
            values.push(this.multiChoiceElement.currentValue);
            labels.push(this.multiChoiceElement.choiceInfo[choice].label);
          }
        }
      }

      if (this.multiChoiceElement.allowFreetext) {
        this.isFreeText = true;
        // this.freeTextValue = this.multiChoiceElement.currentValue;
        this.showOrHideFreeText(this.multiChoiceElement.id, 'freetext', true);
      }

      this.selectedMultiChoice(this.multiChoiceElement.id, this.multiChoiceElement.label, values, labels);
    } else {
      this.returnMultiChoice.emit(undefined);
    }
  }

  selectedMultiChoice(elementId: string, selectedCondition: string, choiceValue: any, choiceLabel: any) {
    const multiElement = new MultiChoiceElement();
    if ($('#' + elementId + '_' + choiceValue).is(':checked')) {
      // this.multiChoiceValues = choiceLabel;
      this.multiChoiceComaprisonValues = choiceValue;
    } else {
      const index = this.multiChoiceValues.indexOf(choiceLabel);
      const comparisonIndex = this.multiChoiceComaprisonValues.indexOf(choiceValue);
      if (index > -1) {
        this.multiChoiceValues.splice(index, 1);
      }
      if (comparisonIndex > -1) {
        this.multiChoiceComaprisonValues.splice(comparisonIndex, 1);
      }
    }

    const selectedValues = this.GetSelectedItems();
    multiElement.elementId = elementId;
    multiElement.selectedValues = selectedValues; //this.multiChoiceValues;
    multiElement.selectedComparisonValues = selectedValues; // this.multiChoiceComaprisonValues;

    this.selectedCondition = new SelectedCondition();
    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = selectedValues; //this.multiChoiceValues;
    this.returnMultiChoice.emit({ receivedElement: multiElement, selectedCondition: this.selectedCondition });
  }

  // ifExist(item) {
  //   const items = this.multiChoiceElement.choiceInfo as any[];
  //   for (let i = 0; i < items.length; i++) {
  //     if (this.multiChoiceElement.choiceInfo.choices[i].value === item) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }

  choiceSelected(elementId: string, selectedElement: string, selectedText: string, selectedValue: string, event) {
    if (event.target.checked) {
      this.showOrHideFreeText(elementId, selectedValue, true);
    } else {
      $('#txt_other_' + this.multiChoiceElement.id).val('');
      this.freeTextValue = '';
      this.showOrHideFreeText(elementId, selectedValue, false);
    }

    this.updateMultiChoice(elementId, selectedElement, this.freeTextValue, event);
  }

  updateFreeText(element, elementId, selectedCondition) {
    const selectedValue = (element.value === 'Other') ? 'freetext' : element.value;
    const selectedText = element.value;
    // this.updateMultiChoice(elementId, selectedCondition, selectedText, selectedValue);

    const selectedValues = this.GetSelectedItems();

    const multiElement = new MultiChoiceElement();
    multiElement.elementId = elementId;
    multiElement.selectedValues = selectedValues; //selectedValue;
    multiElement.selectedComparisonValues = selectedValues;

    this.selectedCondition = new SelectedCondition();
    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = selectedValues;
    this.returnMultiChoice.emit({ receivedElement: multiElement, selectedCondition: this.selectedCondition });
  }

  updateMultiChoice(elementId: string, selectedCondition: string, value: string, event) {
    const multiElement = new MultiChoiceElement();
    if (event.currentTarget != undefined && event.currentTarget.checked) {
      if (value != '') {
        if (this.multiChoiceValues.indexOf(value) === -1) {
          this.multiChoiceValues.push(value);
        }
        if (this.multiChoiceComaprisonValues.indexOf(value) === -1) {
          this.multiChoiceComaprisonValues.push(event.currentTarget.value);
        }
      }
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

    const selectedValues = this.GetSelectedItems();

    multiElement.elementId = elementId;
    multiElement.selectedValues = selectedValues; //this.multiChoiceValues;
    multiElement.selectedComparisonValues = selectedValues; // this.multiChoiceComaprisonValues;

    this.selectedCondition = new SelectedCondition();
    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = selectedValues; //this.multiChoiceValues;
    this.returnMultiChoice.emit({ receivedElement: multiElement, selectedCondition: this.selectedCondition });
  }

  private GetSelectedItems() {
    var items = document.getElementsByClassName('multiselectItems_' + this.multiChoiceElement.id) as any;
    var selectedItems = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].checked == true) {
        selectedItems.push(items[i].value);
      }
    }

    var selectedValues = selectedItems;
    if ($('#txt_other_' + this.multiChoiceElement.id).val() != '') {
      selectedValues.push($('#txt_other_' + this.multiChoiceElement.id).val());
    }

    return selectedValues;
  }

  private createMultiChoiceElementForm() {
    this.multiChoiceElementForm = this.formBuilder.group({
      multiCheckBox: ['', Validators.required],
    }, {
        validator: this.specificValueInsideRange('multiCheckBox')
      });
  }

  showOrHideFreeText(elementId: string, selectedValue: string, isChecked) {
    if (selectedValue === 'freetext' && isChecked) {
      $('#div_' + elementId + '_other').show();
      if (selectedValue == 'freetext') {
        this.freeTextValue = $('#txt_other_' + this.multiChoiceElement.id).val();
      }
    } else if (!isChecked) {
      $('#div_' + elementId + '_other').hide();
      this.freeTextValue = '';
      this.isFreeText = false;
    }
  }

  private specificValueInsideRange(checkBoxKey: string) {
    return (group: FormGroup) => {
      const choiceControl = group.controls[checkBoxKey];
      if (this.multiChoiceElement.isRequired) {
        return choiceControl.setErrors({ notEquivalent: true });
      } else {
        return choiceControl.setErrors(null);
      }
    };
  }
}
