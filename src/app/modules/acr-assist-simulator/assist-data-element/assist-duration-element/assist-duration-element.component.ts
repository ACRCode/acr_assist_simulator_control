import { Component, OnInit, Input } from '@angular/core';
import { DurationDataElement } from '../../../core/elements/models/duration-data-element.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';


@Component({
  selector: 'acr-assist-duration-element',
  templateUrl: './assist-duration-element.component.html',
  styleUrls: ['./assist-duration-element.component.css']
})
export class AssistDurationElementComponent implements OnInit {
  @Input() durationDataElement: DurationDataElement;
  durationElementForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService) { }

  durationOptions = {
    showNegative: false,
    showPreview: false,
    showYears: false,
    showMonths: false,
    showWeeks: false
  };

  ngOnInit() {
    this.createDurationElementForm();
  }

  private createDurationElementForm() {
    this.durationElementForm = this.formBuilder.group({
      durationElement: ['', Validators.compose([Validators.required])],
    });
  }
}
