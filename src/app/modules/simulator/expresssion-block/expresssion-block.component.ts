import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { DataElement } from '../shared/models/data-element.model';
import { ExecutedResults } from '../shared/models/executed-results.model';

@Component({
    selector: 'acr-expresssion-block',
    templateUrl: './expresssion-block.component.html',
    styleUrls: ['../../styles.css']
})
export class ExpresssionBlockComponent {
    @Input() FormValues: Object = {};
    @Input() ExpBlock: ExpressionBlock;
    @Input() DataElements: DataElement[] = [];
    @Output() onExpressionChanged: EventEmitter<DataElement[]> = new EventEmitter<DataElement[]>();    
    @Output() onValueRecieved = new EventEmitter<ExecutedResults>();
  
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
        if (result  ) {
          setTimeout(() => {
            this.onExpressionChanged.emit(this.ExpBlock.NotRelavantDataElements);
	    if(this.globalsService.expressionResults !=undefined)
	    {
	    	this.onValueRecieved.emit(this.globalsService.expressionResults);
	        this.globalsService.expressionResults = null;
	    }
          }, 100);

        }
        return result;
    }

  changedValues(expressionResult : ExecutedResults ){
      this.globalsService.expressionResults = expressionResult;
          //this.onValueRecieved.emit([values]);
  }

}
