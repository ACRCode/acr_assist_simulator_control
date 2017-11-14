import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';
import { StringUtilityService } from '../shared/services/string-utility.service';

@Component({
  selector: 'acr-data-element',
  templateUrl: './data-element.component.html',
  styleUrls: ['./data-element.component.css']
})
export class DataElementComponent  {
  @Input() DataElements: DataElement[] = [];
  @Input() FormValues: Object = {};
  @Input() ValidationBlocks = [];
  formInitialized = true;
  defaultOption = 'Select';


  constructor(private stringUtilityService: StringUtilityService) {}


  itemSelected() {
  }


   evaluate(cond) {
     return eval(cond);
  }
  updateMultichoice(DataElementID, choiceValue, event) {
    let previousValue = this.FormValues[DataElementID];
    if (event.currentTarget.checked) {
      if (previousValue === undefined) {
        previousValue = [];
      }
      previousValue.push(choiceValue);
    } else {
      const index = previousValue.indexOf(choiceValue);
      if (index > -1) {
        previousValue.splice(index, 1);
      }
    }
    this.FormValues[DataElementID] = previousValue;
  }
}
