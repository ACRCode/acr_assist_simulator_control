import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { DateTimeDataElement } from 'testruleengine/Library/Models/Class';
import { UtilityService } from '../../../core/services/utility.service';
import { DateTimeElement } from '../model/data.model';
declare var triggerToolTip: any;

@Component({
  selector: 'acr-assist-date-time-element',
  templateUrl: './assist-date-time-element.component.html',
  styleUrls: ['./assist-date-time-element.component.css']
})
export class AssistDateTimeElementComponent implements OnInit, AfterViewInit {

  selectedCondition: SelectedCondition;
  dateTimeElementForm: FormGroup;
  settings = {
    bigBanner: true,
    format: 'dd-MMM-yyyy hh:mm a',
    defaultOpen: false,
    timePicker: true,
    closeOnSelect: true
  };

  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() assetsBaseUrl: string;
  @Input() dateTimeDataElement: DateTimeDataElement;
  @Output() returnDateTimeElement = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    public utilityService: UtilityService) { }

  ngOnInit() {
    this.createDateTimeElementForm();
  }

  ngAfterViewInit(): void {
    if (this.dateTimeDataElement.currentValue !== undefined) {
      this.dateTimeElementForm.controls.dateTimeElement.setValue(new Date(this.dateTimeDataElement.currentValue));
      this.onDateTimeSelected();
    } else {
      this.returnDateTimeElement.emit(undefined);
    }

    triggerToolTip();
  }

  onDateTimeSelected() {
    const date = this.dateTimeElementForm.controls.dateTimeElement.value;
    if (date != null) {
      const localDateTime = new Date(date.toString()).toLocaleString();
      const dateTimeElement = new DateTimeElement();
      dateTimeElement.elementId = this.dateTimeDataElement.id;
      dateTimeElement.selectedValue = localDateTime;

      this.selectedCondition = new SelectedCondition();

      this.selectedCondition.selectedConditionId = this.dateTimeDataElement.id;
      this.selectedCondition.selectedCondition = this.dateTimeDataElement.label;
      this.selectedCondition.selectedValue = localDateTime;
      this.returnDateTimeElement.emit({ receivedElement: dateTimeElement, selectedCondition: this.selectedCondition });
    }
  }

  isDateTimeElementRequired(): boolean {
    return this.dateTimeElementForm.controls.dateTimeElement.invalid &&
      this.dateTimeElementForm.controls.dateTimeElement.errors.required &&
      this.dateTimeDataElement.isRequired;
  }

  private createDateTimeElementForm() {
    this.dateTimeElementForm = this.formBuilder.group({
      dateTimeElement: ['', Validators.compose([Validators.required, Validators.min(+0), Validators.max(+1)])],
    });
  }
}

