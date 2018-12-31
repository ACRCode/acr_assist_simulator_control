import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { DateTimeDataElement } from '../../../core/elements/models/datetime.model';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { DateTimeElement } from '../assist-data-element.component';

@Component({
  selector: 'acr-assist-date-time-element',
  templateUrl: './assist-date-time-element.component.html',
  styleUrls: ['./assist-date-time-element.component.css']
})
export class AssistDateTimeElementComponent implements OnInit, AfterViewInit {
  @Input() dateTimeDataElement: DateTimeDataElement;
  @Output() returnDateTimeElement = new EventEmitter();
  selectedCondition: SelectedCondition;
  dateTimeElementForm: FormGroup;
  date = new Date();
  settings = {
    bigBanner: true,
    format: 'dd-MMM-yyyy hh:mm a',
    defaultOpen: false,
    timePicker: true,
    closeOnSelect: true
};

  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService) { }

  ngOnInit() {
    this.createDateTimeElementForm();
  }

  ngAfterViewInit(): void {
    if (this.dateTimeDataElement.currentValue !== undefined) {
      this.onDateTimeSelected();
    } else {
      this.returnDateTimeElement.emit(undefined);
    }
  }

  onDateTimeSelected() {
    const localDateTime = new Date(this.date.toString()).toLocaleString();
    const dateTimeElement = new DateTimeElement();
    dateTimeElement.elementId = this.dateTimeDataElement.id;
    dateTimeElement.selectedValue = localDateTime;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = this.dateTimeDataElement.id;
    this.selectedCondition.selectedCondition = this.dateTimeDataElement.label;
    this.selectedCondition.selectedValue = localDateTime;
    this.returnDateTimeElement.emit({ receivedElement: dateTimeElement, selectedCondition: this.selectedCondition });
  }

  private createDateTimeElementForm() {
    this.dateTimeElementForm = this.formBuilder.group({
      dateTimeElement: ['', Validators.compose([Validators.required, Validators.min(+0), Validators.max(+1)])],
    });
  }
}

