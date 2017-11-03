import { Component, OnInit, Input } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-data-element',
  templateUrl: './data-element.component.html',
  styleUrls: ['./data-element.component.css']
})
export class DataElementComponent implements OnInit {

      @Input() DataElements: DataElement[] = [];
      @Input() FormValues: Object = {};
      @Input() ValidationBlocks = [];
      DataElementObj = {};
      ngOnInit() {
          this.DataElements.forEach(de => {
              this.DataElementObj[de.ID] = de;
          });
      }
      evaluate(cond) {
         return  eval(cond);
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
