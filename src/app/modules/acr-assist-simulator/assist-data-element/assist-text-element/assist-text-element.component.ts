import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { TextDataElement } from 'testruleengine/Library/Models/Class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { UtilityService } from '../../../core/services/utility.service';
import { TextElement } from '../model/data.model';
declare var triggerToolTip: any;

@Component({
  selector: 'acr-assist-text-element',
  templateUrl: './assist-text-element.component.html',
  styleUrls: ['./assist-text-element.component.css', '../../styles.css']
})

export class AssistTextElementComponent implements OnInit, AfterViewInit {

  textElementForm: FormGroup;
  selectedCondition: SelectedCondition;

  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() assetsBaseUrl: string;
  @Input() textDataElement: TextDataElement;
  @Output() returnTextElement = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
    private simulatorEngineService: SimulatorEngineService,
    public utilityService: UtilityService) { }

  ngOnInit() {    
    this.createTextElementForm();
  }

  ngAfterViewInit(): void {
    if (this.textDataElement.currentValue !== undefined && this.textDataElement.currentValue !== '') {
      this.simulatorEngineService.addOrUpdateDataElement(this.textDataElement.id, this.textDataElement.currentValue,
        this.textDataElement.currentValue);
      this.textElementForm.controls.textElement.setValue(this.textDataElement.currentValue);
      this.loadedTextValue(this.textDataElement.id, this.textDataElement.currentValue, this.textDataElement.label);
    } else {
      this.returnTextElement.emit(undefined);
    }

    triggerToolTip();
  }

  loadedTextValue(id, value, selectedCondition) {
    const textElement = new TextElement();
    textElement.elementId = id;
    textElement.selectedValue = value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = value;
    this.returnTextElement.emit({ receivedElement: textElement, selectedCondition: this.selectedCondition });
  }

  textSelected(element, selectedCondition) {
    const textElement = new TextElement();
    textElement.elementId = element.id;
    textElement.selectedValue = element.value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = element.id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = element.value;
    
    this.returnTextElement.emit({ receivedElement: textElement, selectedCondition: this.selectedCondition });
  }

  isTextElementRequired(): boolean {
    return this.textElementForm.controls.textElement.invalid &&
      this.textElementForm.controls.textElement.errors.required &&
      this.textDataElement.isRequired;
  }

  private createTextElementForm() {
    this.textElementForm = this.formBuilder.group({
      textElement: ['', Validators.compose
        ([
          Validators.required          
        ])],
    });
  }

  hasAIInputStyle():boolean {    
    if (this.utilityService.isNotEmptyString(this.textDataElement.sources)) {
      const elem = this.textDataElement.sources.find(x => x.id === this.textDataElement.id);
      if (this.utilityService.isValidInstance(elem)) {
        return elem.value === this.textDataElement.controls.textElement.value;
      }
    }

    return false;
  }
}
