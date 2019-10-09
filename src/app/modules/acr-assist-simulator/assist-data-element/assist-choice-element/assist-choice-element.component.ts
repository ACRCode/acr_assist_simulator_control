import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChoiceDataElement } from 'testruleengine/Library/Models/Class';
import { ChoiceElement } from '../assist-data-element.component';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RepeatedElementSections } from '../../../core/elements/models/RepeatedElementSections';
import { ChoiceElementDisplayEnum } from '../../../core/models/choice-element-display.enum';
import { UtilityService } from '../../../core/services/utility.service';

const $ = require('jquery');

@Component({
  selector: 'acr-assist-choice-element',
  templateUrl: './assist-choice-element.component.html',
  styleUrls: ['./assist-choice-element.component.css', '../../styles.css']
})
export class AssistChoiceElementComponent implements OnInit, AfterViewInit {

  isFreeText = false;
  freeTextValue: string;
  choiceElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  selectedIndex: number;
  selectedChoiceReportText: string;
  selectedChoiceReportLabel: string;
  elementDisplay: ChoiceElementDisplayEnum;

  @Input() choiceElementDisplay: ChoiceElementDisplayEnum;
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() repeatedElementSections: RepeatedElementSections;
  @Input() choiceDataElement: ChoiceDataElement;
  @Input() imagePath: string;
  @Input() disabled: boolean;

  @Output() returnChoiceElement = new EventEmitter();
  @Output() choiceChange = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.createChoiceElementForm();
    if (!this.utilityService.isValidInstance(this.choiceElementDisplay)) {
      if (this.choiceDataElement.choiceInfo.length <= 2) {
        this.elementDisplay = ChoiceElementDisplayEnum.RadioButton;
      } else if (this.choiceDataElement.choiceInfo.length > 2 && this.choiceDataElement.choiceInfo.length <= 5) {
        this.elementDisplay = ChoiceElementDisplayEnum.ListBox;
      } else if (this.choiceDataElement.choiceInfo.length > 2 && this.choiceDataElement.choiceInfo.length > 5) {
        this.elementDisplay = ChoiceElementDisplayEnum.SelectBox;
      }
    } else {
      this.elementDisplay = JSON.parse(JSON.stringify(this.choiceElementDisplay));
    }
  }

  ngAfterViewInit(): void {
    this.showOrHideFreeText(this.choiceDataElement.id, '');
    if (this.choiceDataElement.currentValue !== undefined) {
      $('#' + this.choiceDataElement.currentValue + '_' + this.choiceDataElement.id).prop('checked', true);
      this.choiceElementForm.controls.checkBox.setValue(this.choiceDataElement.currentValue);
      for (const choice in this.choiceDataElement.choiceInfo) {
        if (this.choiceDataElement.choiceInfo[choice].value === this.choiceDataElement.currentValue) {
          if (this.choiceDataElement.choiceInfo[choice].reportText !== undefined) {
            this.selectedChoiceReportText = this.choiceDataElement.choiceInfo[choice].reportText;
          } else {
            this.selectedChoiceReportLabel = this.choiceDataElement.choiceInfo[choice].label;
          }
        }
      }

      // tslint:disable-next-line:max-line-length
      if (this.choiceDataElement.allowFreetext && this.selectedChoiceReportText === undefined && this.selectedChoiceReportLabel === undefined) {
        this.isFreeText = true;
        this.freeTextValue = this.choiceDataElement.currentValue;
        this.showOrHideFreeText(this.choiceDataElement.id, 'freetext');
      }

      let currentLabel = this.selectedChoiceReportText !== undefined ? this.selectedChoiceReportText : this.selectedChoiceReportLabel;
      if (currentLabel === undefined && this.isFreeText) {
        currentLabel = this.choiceDataElement.currentValue;
      }
      this.setChoiceValue(this.choiceDataElement.id, this.choiceDataElement.label, currentLabel, this.choiceDataElement.currentValue);
    } else {
      this.returnChoiceElement.emit(undefined);
    }

    this.cdr.detectChanges();
    if (this.choiceDataElement.choiceInfo.length > 2 && this.choiceDataElement.choiceInfo.length <= 5) {
      $('#' + this.choiceDataElement.id).attr('size', this.choiceDataElement.choiceInfo.length + 1);
    }

    // tslint:disable-next-line:max-line-length
    if (this.choiceDataElement.choiceInfo.length > 2 && this.choiceDataElement.choiceInfo.length <= 5 && this.choiceDataElement.allowFreetext) {
      $('#' + this.choiceDataElement.id).attr('size', this.choiceDataElement.choiceInfo.length + 2);
    }
  }

  isRadioButton(): boolean {
    return this.elementDisplay === ChoiceElementDisplayEnum.RadioButton;
  }

  isListBox(): boolean {

    return this.elementDisplay === ChoiceElementDisplayEnum.ListBox;
  }

  isSelectBox(): boolean {
    return this.elementDisplay === ChoiceElementDisplayEnum.SelectBox;
  }

  setChoiceValue(elementId: string, selectedElement: string, selectedText: string, selectedValue: string) {
    if (selectedValue !== undefined) {
      this.emitChoiceElementData(elementId, selectedElement, selectedText, selectedValue);
    }
  }

  choiceSelected(elementId: string, selectedElement: string, selectedText: string, selectedValue: string) {
    this.showOrHideFreeText(elementId, selectedValue);
    this.emitChoiceElementData(elementId, selectedElement, selectedText, selectedValue);
  }

  dropdownChoiceSelected(element, selectedCondition) {
    const elementId = element.id;
    const selectedElement = selectedCondition;
    let selectedText = element.options[element.selectedIndex].text;
    let selectedValue = element.value;

    this.showOrHideFreeText(element.id, selectedValue);
    const choiceValue = this.choiceElementForm.controls.checkBox.value;

    if (choiceValue === 'Select one' || choiceValue === undefined || choiceValue === '') {
      selectedText = '';
      selectedValue = '';
    }

    this.emitChoiceElementData(elementId, selectedElement, selectedText, selectedValue);
  }

  updateFreeText(element, elementId, selectedCondition) {
    const selectedValue = (element.value === 'Other') ? 'freetext' : element.value;
    const selectedText = element.value;

    this.emitChoiceElementData(elementId, selectedCondition, selectedText, selectedValue);
  }

  showOrHideFreeText(elementId: string, selectedValue: string) {
    if (selectedValue === 'freetext') {
      $('#div_' + elementId + '_other').show();
    } else {
      $('#div_' + elementId + '_other').hide();
      this.freeTextValue = '';
      this.isFreeText = false;
    }
  }

  isChoiceElementRequired(): boolean {
    return this.choiceElementForm.controls.checkBox.invalid  && this.choiceDataElement.isRequired;
  }

  private emitChoiceElementData(elementId: string, selectedElement: string, selectedText: string, selectedValue: string) {
    const choiceElement = new ChoiceElement();
    choiceElement.elementId = elementId;
    choiceElement.selectedValue = selectedValue;
    choiceElement.selectedText = selectedText;

    this.selectedCondition = new SelectedCondition();
    this.selectedCondition.selectedConditionId = elementId;
    this.selectedCondition.selectedCondition = selectedElement;
    this.selectedCondition.selectedValue = selectedText;

    this.returnChoiceElement.emit({ receivedElement: choiceElement, selectedCondition: this.selectedCondition });
  }

  private createChoiceElementForm() {
    this.choiceElementForm = this.formBuilder.group({
      checkBox: ['', Validators.required],
    }, {
        validator: this.specificValueInsideRange('checkBox')
      });
  }

  private specificValueInsideRange(checkBox: string) {
    return (group: FormGroup) => {
      const choiceControl = group.controls.checkBox;
      if ((choiceControl.value === undefined || choiceControl.value === '' || choiceControl.value === 'Select one')) {
        return choiceControl.setErrors({ notEquivalent: true });
      } else {
        return choiceControl.setErrors(null);
      }
    };
  }
}
