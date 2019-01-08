import { Component, OnInit, Input } from '@angular/core';
import { DateTimeDataElement } from '../../../../core/elements/models/datetime.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SimulatorEngineService } from '../../../../core/services/simulator-engine.service';

@Component({
  selector: 'acr-assist-date-time-element',
  templateUrl: './assist-date-time-element.component.html',
  styleUrls: ['./assist-date-time-element.component.css']
})
export class AssistDateTimeElementComponent implements OnInit {
  @Input() dateTimeDataElement: DateTimeDataElement;
  dateTimeElementForm: FormGroup;
  date = new Date();
  settings = {
    bigBanner: true,
    format: 'dd-MMM-yyyy hh:mm a',
    defaultOpen: false,
    timePicker: true,
    closeOnSelect: true,
    // disabled: true
};

  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService) { }

  ngOnInit() {
    this.createDateTimeElementForm();
  }

  onDateSelect() {
    // alert();
  }

  dateTimeValueChanged(event) {
    // alert();
  }

  private createDateTimeElementForm() {
    this.dateTimeElementForm = this.formBuilder.group({
      dateTimeElement: ['', Validators.compose([Validators.required, Validators.min(+0), Validators.max(+1)])],
    });
  }
}

