import { Component, OnInit , Input , Output , EventEmitter } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-expresssion-block',
  templateUrl: './expresssion-block.component.html',
  styleUrls: ['./expresssion-block.component.css']
})
export class ExpresssionBlockComponent   {
  @Input() FormValues: Object = {};
  @Input() ExpBlock: ExpressionBlock;
  @Input() DataElements: DataElement[] = [];
  @Output() onExpressionChanged: EventEmitter<DataElement[]> = new EventEmitter<DataElement[]>();

  constructor(private globalsService: GlobalsService) {

   }

  validate(cond) {
      if (cond === '') {
          return false;
      }
      return eval(cond);
  }

  evaluate(cond, notRelevantDataElments) {
     if (cond === '') {
          return false;
      }
      const result = eval(cond);
      if (result && this.globalsService.evaluateExpessions) {
          this.onExpressionChanged.emit(this.ExpBlock.NotRelavantDataElements);
      }
      return result;
  }

}
