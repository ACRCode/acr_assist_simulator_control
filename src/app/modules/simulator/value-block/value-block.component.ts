import { Component, OnInit, Input } from '@angular/core';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { DataElement } from '../shared/models/data-element.model';
import { GlobalsService } from '../shared/services/globals.service';

@Component({
  selector: 'acr-value-block',
  templateUrl: './value-block.component.html',
  styleUrls: ['./value-block.component.css']
})

export class ValueBlockComponent  {

  @Input() ValueBlock: ExpressionBlock;
  @Input() DataElement: DataElement;
  @Input() DataElements: Object = {};
  @Input() FormValues: Object = {};


  constructor(private globalsService: GlobalsService) {}

  evaluate(exp) {
      if (this.ValueBlock.ParentID === '0' && this.ValueBlock.Level === 0 && this.ValueBlock.Index === 0) {
          this.globalsService.ComputedElementConditions[this.DataElement.ID] = {};
          this.FormValues[this.DataElement.ID] = '';
      }
      if (this.FormValues[this.DataElement.ID] !== '') {
        return false;
      }
      if (exp === '') {
          return true;
      }
      const result = eval(exp);
      if (result) {
          const temp = this.globalsService.ComputedElementConditions[this.DataElement.ID];
          temp[this.ValueBlock.ParentID] = this.ValueBlock.Index;
          this.globalsService.ComputedElementConditions[this.DataElement.ID] = temp;
          if (this.ValueBlock.TextExpression !== undefined && this.ValueBlock.TextExpression.length > 0) {
            this.FormValues['hasAbnormality'] = this.textify(this.ValueBlock.TextExpression);
          } else if (this.ValueBlock.ArithmeticExpression !== '') {
            this.FormValues['hasAbnormality'] = this.compute(this.ValueBlock.ArithmeticExpression);
          }
      }
      return result;

    }
  validate(exp) {
      if (exp === '') {
          return false;
      }
      return eval(exp);
  }

  compute(exp) {
      const result = eval(exp);
      this.DataElement.Value = result;
      this.FormValues[this.DataElement.ID] = result;
      return result;
  }


  textify(textBlocks) {
      let res = '';
      if (textBlocks.constructor.name === 'String') {
          res += textBlocks;
      } else if (textBlocks.length > 0) {
          textBlocks.forEach(text => {
          if (text.constructor.name === 'String') {
              res += text;
          } else if (text.constructor.name === 'Object') {
                  res += ' ' + this.FormValues[text.InsertValue.Attr.DataElementId] + ' ';
          }
          });
      }
      this.FormValues[this.DataElement.ID] = res;
      return res;
  }
}

