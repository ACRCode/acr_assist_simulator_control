import { Component, OnInit, Input } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-computed-element',
  templateUrl: './computed-element.component.html',
  styleUrls: ['./computed-element.component.css']
})
export class ComputedElementComponent {
  @Input() DataElement: DataElement;
  @Input() DataElements: Object = {};
  @Input() FormValues: Object = {};

  compute(exp) {
    const result = eval(exp);
    this.DataElement.Value = result;
    this.FormValues[this.DataElement.ID] = result;
    return result;
  }

  textify(textBlocks) {
    let result = '';
    if (textBlocks.constructor.name === 'String') {
      result += textBlocks;
    } else if (textBlocks.length > 0) {
      textBlocks.forEach(text => {
        if (text.constructor.name === 'String') {
          result += text;
        } else if (text.constructor.name === 'Object') {
          result += ' ' +  this.FormValues[text.InsertValue.Attr.DataElementId] + ' ';
        }
      });
    }
    this.FormValues[this.DataElement.ID] = result;
    return result;
  }
}
