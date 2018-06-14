import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, NgModule } from '@angular/core';
import { ImageElements } from '../../../core/elements/models/image-elements.model';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { ChoiceElement } from '../assist-data-element.component';
import { SelectedCondition } from '../../../core/models/executed-result.model';
const $ = require('jquery');
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
@Component({
  selector: 'acr-assist-choice-element',
  templateUrl: './assist-choice-element.component.html',
  styleUrls: ['./assist-choice-element.component.css', '../../styles.css']
})
export class AssistChoiceElementComponent implements OnInit, AfterViewInit {
  @Input() choiceDataElement: ChoiceDataElement;
  @Input() imagePath: string;
  @Output() returnChoiceElement = new EventEmitter();
  @Output() choiceChange = new EventEmitter();
  choiceValue: string;

  choiceElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  selectedIndex: number;
  selectedChoiceReportText: string;
  selectedChoiceReportLabel: string;

  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService) {}
  ngOnInit(): void {
    this.createChoiceElementForm();
  }

  ngAfterViewInit(): void {
    $('#div_' + this.choiceDataElement.id + '_other').hide();
    if (this.choiceDataElement.currentValue !== undefined) {
      $('#' + this.choiceDataElement.currentValue + '_' + this.choiceDataElement.id).prop('checked', true);
      this.choiceValue = this.choiceDataElement.currentValue;
      for (const choice in this.choiceDataElement.choiceInfo) {
        if (this.choiceDataElement.choiceInfo[choice].value === this.choiceDataElement.currentValue) {
            if (this.choiceDataElement.choiceInfo[choice].reportText !== undefined) {
              this.selectedChoiceReportText = this.choiceDataElement.choiceInfo[choice].reportText;
            } else {
              this.selectedChoiceReportLabel = this.choiceDataElement.choiceInfo[choice].label;
            }
        }
      }

      if (this.choiceDataElement.choiceInfo.length <= 2) {
        this.updateChoiceValue(this.choiceDataElement.id, this.choiceDataElement.label,
          (this.selectedChoiceReportText !== undefined) ? this.selectedChoiceReportText : this.selectedChoiceReportLabel, this.choiceDataElement.currentValue);
      } else {
        this.updateDropdownChoiceSelected(this.choiceDataElement.id, this.selectedChoiceReportLabel, this.choiceDataElement.currentValue, this.choiceDataElement.label);
      }
    }
  }

  updateChoiceValue (elementId: string, selectedElement: string, selectedText: string, selectedValue: string) {
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

  updateDropdownChoiceSelected(elementId, elementLabel, elementValue, selectedCondition) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = elementId;
    choiceElement.selectedValue = elementValue;
    choiceElement.selectedText = elementLabel;

    if (this.choiceValue === 'undefined' || this.choiceValue === undefined || this.choiceValue === '') {
      choiceElement.selectedText = '';
      choiceElement.selectedValue = '';
    }

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = elementLabel;
    this.returnChoiceElement.emit({receivedElement: choiceElement, selectedCondition: this.selectedCondition});
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
    choiceElement.selectedValue = (element.selectedOptions[0].label === 'Other, please specify…') ? 'freetext' : element.value;
    choiceElement.selectedText = element.selectedOptions[0].label;

    this.showOrHideFreeText(element.id, choiceElement.selectedValue);

    if (this.choiceValue === 'undefined' || this.choiceValue === undefined || this.choiceValue === '') {
      choiceElement.selectedText = '';
      choiceElement.selectedValue = '';
    }

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
    if (selectedValue === 'freetext') {
      $('#div_' + elementId + '_other').show();
    } else {
      $('#div_' + elementId + '_other').hide();
      $('#txt_other_' + elementId).val('');
    }
  }

  updateFreeText (element, elementId, selectedCondition) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = elementId;
    choiceElement.selectedValue = (element.value === 'Other') ? 'freetext' : element.value;
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
      if ((choiceControl.value === 'undefined' || choiceControl.value === '' || this.choiceValue === undefined || this.choiceValue === '')) {
        return choiceControl.setErrors({ notEquivalent: true });
      } else {
        return choiceControl.setErrors(null);
      }
    };
  }
}
