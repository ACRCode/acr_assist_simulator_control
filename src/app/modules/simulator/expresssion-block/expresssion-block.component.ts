import { Component, OnInit , Input} from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-expresssion-block',
  templateUrl: './expresssion-block.component.html',
  styleUrls: ['./expresssion-block.component.css']
})
export class ExpresssionBlockComponent  {

  constructor(private globalsService: GlobalsService) { }
  @Input() FormValues: Object = {};
  @Input() ExpBlock: ExpressionBlock = new ExpressionBlock();
  @Input() DataElements: DataElement[] = [];


  validate(cond) {
      if (cond === '') {
          return false;
      }
      return eval(cond);
  }

  evaluate(cond, notRelevantDataElments) {

      if (this.ExpBlock.Level === 0 && this.ExpBlock.Index === 0) {
          this.globalsService.ExecutedConditionsIndexes = {};
          this.globalsService.ExecutedConditions = {};
      } else {
        if (this.ExpBlock.Index === 0) {
          this.globalsService.ExecutedConditionsIndexes[this.ExpBlock.Level] = undefined;
          this.globalsService.ExecutedConditions[this.ExpBlock.Level] = undefined;
        }
      }
      if (this.globalsService.ExecutedConditionsIndexes[this.ExpBlock.Level] !== undefined
          && this.globalsService.ExecutedConditionsIndexes[this.ExpBlock.Level] !== this.ExpBlock.Index) {
          return false;
      }
      if (cond === '') {
          return false;
      }
      const result = eval(cond);
      if (result) {

          this.globalsService.ExecutedConditionsIndexes[this.ExpBlock.Level] = this.ExpBlock.Index;
          this.globalsService.ExecutedConditions[this.ExpBlock.Level] = this.ExpBlock.TextCondition;
          this.displayDataElements(this.ExpBlock.NotRelavantDataElements);
      }
      return result;
  }

  displayDataElements(notRelevantDataElments) {
      this.DataElements.forEach(de => {
          const deindex = this.DataElements.indexOf(de);
          if (notRelevantDataElments !== undefined && notRelevantDataElments.indexOf(deindex) !== -1) {
              de.Visible = false;
          } else {
              de.Visible = true;
          }
      });
  }

}
