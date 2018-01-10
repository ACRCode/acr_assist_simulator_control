import { Component, OnInit, Input } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';

@Component({
  selector: 'acr-assist-numeric-element',
  templateUrl: './assist-numeric-element.component.html',
  styleUrls: ['../../../../modules/styles.css']
})
export class AssistNumericElementComponent implements OnInit {
  @Input() numericDataElement: NumericDataElement;
  @Input() imagePath: string;

  constructor() { }

  ngOnInit() {
  }

}
