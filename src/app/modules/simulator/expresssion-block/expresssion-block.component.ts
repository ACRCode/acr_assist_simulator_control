import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { DataElement } from '../shared/models/data-element.model';
import { ExecutedResults } from '../shared/models/executed-results.model';
import { ExpressionResult } from '../shared/models/expression-result.model';

@Component({
    selector: 'acr-expresssion-block',
    templateUrl: './expresssion-block.component.html',
    styleUrls: ['../../styles.css']
})
export class ExpresssionBlockComponent implements OnInit {

    @Input() FormValues: Object = {};
    @Input() ExpBlock: ExpressionBlock;
    @Input() DataElements: DataElement[] = [];
    @Output() onExpressionChanged: EventEmitter<ExpressionResult> = new EventEmitter<ExpressionResult>();
    constructor(private globalsService: GlobalsService) {

    }

    ngOnInit(): void {

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
        if (result  ) {
          const nonRelevantElemnentIndex: number[] = new Array(this.ExpBlock.NotRelavantDataElements.length);
          for (let i = 0; i < this.ExpBlock.NotRelavantDataElements.length; i++) {
            nonRelevantElemnentIndex[i] = this.ExpBlock.NotRelavantDataElements[i];
           }
           const expressionResult = new ExpressionResult();
           expressionResult.nonRelevantElementIndex = nonRelevantElemnentIndex;
           expressionResult.executedResults = this.globalsService.expressionResults;
           this.onExpressionChanged.emit(expressionResult);
           if (this.globalsService.expressionResults !== undefined) {
               this.globalsService.expressionResults = undefined;
           }
           console.log ('Send' + expressionResult.nonRelevantElementIndex);
        }
        return result;
    }

  changedValues(expressionResult: ExecutedResults ) {
      this.globalsService.expressionResults = expressionResult;
  }

}
