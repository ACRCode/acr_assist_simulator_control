import { Component, OnInit, Input } from '@angular/core';
import { DateTimeDataElement } from '../../../../core/elements/models/datetime.model';

@Component({
  selector: 'acr-assist-date-time-element',
  templateUrl: './assist-date-time-element.component.html',
  styleUrls: ['./assist-date-time-element.component.css']
})
export class AssistDateTimeElementComponent implements OnInit {
  @Input() dateTimeDataElement: DateTimeDataElement;
  constructor() { }

  ngOnInit() {
  }

}

