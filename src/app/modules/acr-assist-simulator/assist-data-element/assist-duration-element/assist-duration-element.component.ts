import { Component, OnInit, Input } from '@angular/core';
import { DurationDataElement } from '../../../core/elements/models/duration-data-element.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { Subscription } from 'rxjs';
import { SimulatorCommunicationService } from '../../shared/services/simulator-communication.service';


@Component({
  selector: 'acr-assist-duration-element',
  templateUrl: './assist-duration-element.component.html',
  styleUrls: ['./assist-duration-element.component.css']
})
export class AssistDurationElementComponent implements OnInit {
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() durationDataElement: DurationDataElement;
  durationElementForm: FormGroup;
  subscription: Subscription;

  supportedUnits: any = {
    millisecond: {
      'label': 'Millisecond',
      'max': 999,
      'min': 0,
      'value': 0,
      'step': 1
    },
    second: {
      'label': 'S',
      'max': 59,
      'min': 0,
      'value': 0,
      'step': 1
    },
    minute: {
      'label': 'M',
      'max': 59,
      'min': 0,
      'value': 0,
      'step': 1
    },
    hour: {
      'label': 'H',
      'max': 23,
      'min': 0,
      'value': 0,
      'step': 1
    },
    day: {
      'label': 'D',
      'max': 7,
      'min': 0,
      'value': 0,
      'step': 1
    },
    week: {
      'label': 'Week',
      'max': 51,
      'min': 0,
      'value': 0,
      'step': 1
    }
  };

  daysvalue = 0;
  hoursvalue = 0;
  minutesvalue = 0;
  secondsValue = 0;

  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService,
    simulatorCommunicationService: SimulatorCommunicationService) {
    this.subscription = simulatorCommunicationService.simulatorSource$.subscribe(
      mission => {
        this.SetRangeValuesForDurationPicker();
        this.UpdateFormValidator();
      });
  }

  DurationVal = 'PT0S';
  durationOptions = {
    showNegative: false,
    showPreview: false,
    showYears: false,
    showMonths: false,
    showWeeks: false,
    min: 0
  };

  showdayminValidation = false;
  showdaymaxValidation = false;
  showminutemaxValidation = false;
  showminuteminValidation = false;
  showhourminValidation = false;
  showhourmaxValidation = false;
  showsecondsminValidation = false;
  showsecondsmaxValidation = false;

  ngOnInit() {
    this.SetRangeValuesForDurationPicker();
    this.createDurationElementForm();
    this.onChanges();
  }

  ResetValidationVisibility(): void {
    this.showdayminValidation = false;
    this.showdaymaxValidation = false;
    this.showminutemaxValidation = false;
    this.showminuteminValidation = false;
    this.showhourminValidation = false;
    this.showhourmaxValidation = false;
    this.showsecondsminValidation = false;
    this.showsecondsmaxValidation = false;
  }

  onChanges(): void {
    this.durationElementForm.statusChanges
      .subscribe(val => {
        this.ResetValidationVisibility();
        if (this.durationElementForm.controls['durationdayselement'] != undefined &&
         this.durationElementForm.controls['durationdayselement'].invalid
          && this.durationElementForm.controls['durationdayselement'].errors.max) {
          this.showdaymaxValidation = true;
        } else if (this.durationElementForm.controls['durationdayselement'] != undefined &&
          this.durationElementForm.controls['durationdayselement'].invalid
          && this.durationElementForm.controls['durationdayselement'].errors.min) {
          this.showdayminValidation = true;
        } else if (this.durationElementForm.controls['durationdayselement'] != undefined &&
        this.durationElementForm.controls['durationminuteselement'].invalid
          && this.durationElementForm.controls['durationminuteselement'].errors.min) {
          this.showminuteminValidation = true;
        } else if (this.durationElementForm.controls['durationminuteselement'] != undefined &&
        this.durationElementForm.controls['durationminuteselement'].invalid
          && this.durationElementForm.controls['durationminuteselement'].errors.max) {
          this.showminutemaxValidation = true;
        } else if (this.durationElementForm.controls['durationhourselement'] != undefined &&
          this.durationElementForm.controls['durationhourselement'].invalid
          && this.durationElementForm.controls['durationhourselement'].errors.min) {
          this.showhourminValidation = true;
        } else if (this.durationElementForm.controls['durationhourselement'] != undefined &&
        this.durationElementForm.controls['durationhourselement'].invalid
          && this.durationElementForm.controls['durationhourselement'].errors.max) {
          this.showhourmaxValidation = true;

        } else if (this.durationElementForm.controls['durationsecondselement'] != undefined &&
          this.durationElementForm.controls['durationsecondselement'].invalid
          && this.durationElementForm.controls['durationsecondselement'].errors.min) {
          this.showsecondsminValidation = true;
        } else if (this.durationElementForm.controls['durationsecondselement'] != undefined &&
        this.durationElementForm.controls['durationsecondselement'].invalid
          && this.durationElementForm.controls['durationsecondselement'].errors.max) {
          this.showsecondsmaxValidation = true;
        }
      });
  }

  private SetRangeValuesForDurationPicker() {
    const $element = this.durationDataElement;
    this.supportedUnits['day'].min = $element.MinimumDay !== undefined && $element.MinimumDay != null ?
      $element.MinimumDay : 0;
    this.supportedUnits['hour'].min = $element.MinimumHours !== undefined && $element.MinimumHours != null ?
      $element.MinimumHours : 0;
    this.supportedUnits['minute'].min = $element.MinimumMinutes !== undefined && $element.MinimumMinutes != null ?
      $element.MinimumMinutes : 0;
    this.supportedUnits['second'].min = $element.MinimumSeconds !== undefined && $element.MinimumSeconds != null ?
      $element.MinimumSeconds : 0;
    this.supportedUnits['day'].max = $element.MaximumDay !== undefined && $element.MaximumDay != null ?
      $element.MaximumDay : 9007199254740991;
    this.supportedUnits['hour'].max = $element.MaximumHours !== undefined && $element.MaximumHours != null ?
      $element.MaximumHours : 9007199254740991;
    this.supportedUnits['minute'].max = $element.MaxmimumMinutes !== undefined && $element.MaxmimumMinutes != null ?
      $element.MaxmimumMinutes : 9007199254740991;
    this.supportedUnits['second'].max = $element.MaxmimumSeconds !== undefined && $element.MaxmimumSeconds != null ?
      $element.MaxmimumSeconds : 9007199254740991;
  }

  private createDurationElementForm() {
    // this.durationElementForm = this.formBuilder.group({
    //   durationdayselement: ['', Validators.compose([Validators.required,
    //   Validators.min(+this.supportedUnits['day'].min), Validators.max(+this.supportedUnits['day'].max)])],
    //   durationminuteselement: ['', Validators.compose([Validators.required,
    //   Validators.min(+this.supportedUnits['minute'].min), Validators.max(+this.supportedUnits['minute'].max)])],
    //   durationhourselement: ['', Validators.compose([Validators.required,
    //   Validators.min(+this.supportedUnits['hour'].min), Validators.max(+this.supportedUnits['hour'].max)])],
    //   durationsecondselement: ['', Validators.compose([Validators.required,
    //     Validators.min(+this.supportedUnits['second'].min), Validators.max(+this.supportedUnits['second'].max)])]      
    // });

    if (this.durationDataElement.ShowDays && this.durationDataElement.ShowHours
      && this.durationDataElement.ShowMinutes
      && this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationdayselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['day'].min), Validators.max(+this.supportedUnits['day'].max)])],
        durationminuteselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['minute'].min), Validators.max(+this.supportedUnits['minute'].max)])],
        durationhourselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['hour'].min), Validators.max(+this.supportedUnits['hour'].max)])],
        durationsecondselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['second'].min), Validators.max(+this.supportedUnits['second'].max)])]
      });
    } else if (!this.durationDataElement.ShowDays && this.durationDataElement.ShowHours
      && this.durationDataElement.ShowMinutes
      && this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationminuteselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['minute'].min), Validators.max(+this.supportedUnits['minute'].max)])],
        durationhourselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['hour'].min), Validators.max(+this.supportedUnits['hour'].max)])],
        durationsecondselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['second'].min), Validators.max(+this.supportedUnits['second'].max)])]
      });
    } else if (this.durationDataElement.ShowDays && !this.durationDataElement.ShowHours
      && this.durationDataElement.ShowMinutes
      && this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationdayselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['day'].min), Validators.max(+this.supportedUnits['day'].max)])],
        durationminuteselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['minute'].min), Validators.max(+this.supportedUnits['minute'].max)])],
        durationsecondselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['second'].min), Validators.max(+this.supportedUnits['second'].max)])]
      });
    } else if (this.durationDataElement.ShowDays && this.durationDataElement.ShowHours
      && !this.durationDataElement.ShowMinutes
      && this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationdayselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['day'].min), Validators.max(+this.supportedUnits['day'].max)])],
        durationhourselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['hour'].min), Validators.max(+this.supportedUnits['hour'].max)])],
        durationsecondselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['second'].min), Validators.max(+this.supportedUnits['second'].max)])]
      });
    } else if (this.durationDataElement.ShowDays && this.durationDataElement.ShowHours
      && this.durationDataElement.ShowMinutes
      && !this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationdayselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['day'].min), Validators.max(+this.supportedUnits['day'].max)])],
        durationminuteselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['minute'].min), Validators.max(+this.supportedUnits['minute'].max)])],
        durationhourselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['hour'].min), Validators.max(+this.supportedUnits['hour'].max)])]
      });
    } else if (this.durationDataElement.ShowDays && !this.durationDataElement.ShowHours
      && !this.durationDataElement.ShowMinutes
      && !this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationdayselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['day'].min), Validators.max(+this.supportedUnits['day'].max)])]
      });
    } else if (!this.durationDataElement.ShowDays && this.durationDataElement.ShowHours
      && !this.durationDataElement.ShowMinutes
      && !this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationhourselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['hour'].min), Validators.max(+this.supportedUnits['hour'].max)])]
      });
    } else if (!this.durationDataElement.ShowDays && !this.durationDataElement.ShowHours
      && this.durationDataElement.ShowMinutes
      && !this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationminuteselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['minute'].min), Validators.max(+this.supportedUnits['minute'].max)])]
      });
    } else if (!this.durationDataElement.ShowDays && !this.durationDataElement.ShowHours
      && !this.durationDataElement.ShowMinutes
      && this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationsecondselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['second'].min), Validators.max(+this.supportedUnits['second'].max)])]
      });
    } else if (!this.durationDataElement.ShowDays && !this.durationDataElement.ShowHours
      && !this.durationDataElement.ShowMinutes
      && !this.durationDataElement.ShowSeconds) {
      this.durationElementForm = this.formBuilder.group({
        durationdayselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['day'].min), Validators.max(+this.supportedUnits['day'].max)])],
        durationminuteselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['minute'].min), Validators.max(+this.supportedUnits['minute'].max)])],
        durationhourselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['hour'].min), Validators.max(+this.supportedUnits['hour'].max)])],
        durationsecondselement: ['', Validators.compose([Validators.required,
        Validators.min(+this.supportedUnits['second'].min), Validators.max(+this.supportedUnits['second'].max)])]
      });
    }
  }

  onlyInteger(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  UpdateFormValidator() {
    this.durationElementForm.controls['durationdayselement'].setValidators([Validators.compose([Validators.required,
    Validators.min(+this.supportedUnits['day'].min), Validators.max(+this.supportedUnits['day'].max)])]);
    this.durationElementForm.controls['durationdayselement'].updateValueAndValidity();

    this.durationElementForm.controls['durationminuteselement'].setValidators([Validators.compose([Validators.required,
    Validators.min(+this.supportedUnits['minute'].min), Validators.max(+this.supportedUnits['minute'].max)])]);
    this.durationElementForm.controls['durationminuteselement'].updateValueAndValidity();

    this.durationElementForm.controls['durationhourselement'].setValidators([Validators.compose([Validators.required,
    Validators.min(+this.supportedUnits['hour'].min), Validators.max(+this.supportedUnits['hour'].max)])]);
    this.durationElementForm.controls['durationhourselement'].updateValueAndValidity();

    this.durationElementForm.controls['durationsecondselement'].setValidators([Validators.compose([Validators.required,
    Validators.min(+this.supportedUnits['second'].min), Validators.max(+this.supportedUnits['second'].max)])]);
    this.durationElementForm.controls['durationsecondselement'].updateValueAndValidity();
  }

  public increaseValue(property): void {
    let currentValue = 0;
    switch (property) {
      case 'days':
        currentValue = this.daysvalue === undefined || this.daysvalue == null ? 0 : this.daysvalue;
        if (currentValue < this.supportedUnits['day'].max) {
          currentValue = currentValue + this.supportedUnits['day'].step;
        }

        this.daysvalue = currentValue;
        break;

      case 'hour':
        currentValue = this.hoursvalue === undefined || this.hoursvalue == null ? 0 : this.hoursvalue;
        if (currentValue < this.supportedUnits['hour'].max) {
          currentValue = currentValue + this.supportedUnits['hour'].step;
        }

        this.hoursvalue = currentValue;
        break;

      case 'minute':
        currentValue = this.minutesvalue === undefined || this.minutesvalue == null ? 0 : this.minutesvalue;
        if (currentValue < this.supportedUnits['minute'].max) {
          currentValue = currentValue + this.supportedUnits['minute'].step;
        }

        this.minutesvalue = currentValue;
        break;

      case 'second':
        currentValue = this.secondsValue === undefined || this.secondsValue == null ? 0 : this.secondsValue;
        if (currentValue < this.supportedUnits['second'].max) {
          currentValue = currentValue + this.supportedUnits['second'].step;
        }

        this.secondsValue = currentValue;
        break;
    }
  }

  public decreaseValue(property): void {
    let currentValue = 0;
    switch (property) {
      case 'days':
        currentValue = this.daysvalue;
        if (currentValue > this.supportedUnits['day'].min) {
          currentValue = currentValue - this.supportedUnits['day'].step;
        }

        this.daysvalue = currentValue;
        break;

      case 'hour':
        currentValue = this.hoursvalue;
        if (currentValue > this.supportedUnits['hour'].min) {
          currentValue = currentValue - this.supportedUnits['hour'].step;
        }

        this.hoursvalue = currentValue;
        break;

      case 'minute':
        currentValue = this.minutesvalue;
        if (currentValue > this.supportedUnits['minute'].min) {
          currentValue = currentValue - this.supportedUnits['minute'].step;
        }

        this.minutesvalue = currentValue;
        break;

      case 'second':
        currentValue = this.secondsValue;
        if (currentValue > this.supportedUnits['second'].min) {
          currentValue = currentValue - this.supportedUnits['second'].step;
        }

        this.minutesvalue = currentValue;
        break;
    }
  }

  checkValue(event: any, property) {
    let currentValue = 0;
    switch (property) {
      case 'days':
        currentValue = this.daysvalue;
        if (currentValue === undefined || currentValue == null) {
          currentValue = 0;
        }

        this.daysvalue = currentValue;
        break;

      case 'hour':
        currentValue = this.hoursvalue;
        if (currentValue === undefined || currentValue == null) {
          currentValue = 0;
        }

        this.hoursvalue = currentValue;
        break;

      case 'minute':
        currentValue = this.minutesvalue;
        if (currentValue === undefined || currentValue == null) {
          currentValue = 0;
        }

        this.minutesvalue = currentValue;
        break;

      case 'second':
        currentValue = this.secondsValue;
        if (currentValue === undefined || currentValue == null) {
          currentValue = 0;
        }

        this.secondsValue = currentValue;
        break;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}



