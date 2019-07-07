import { Injectable } from '@angular/core';
import { TextExpression } from '../../../core/models/text-expression.model';
import { ComputedValue } from 'testruleengine/Library/Models/Class';
import { ArithmeticExpression } from '../../../core/models/arithmetic-expression.model';

@Injectable()
export class ComputedValueCreationService {

  constructor() { }

  createComputedValue(dataAsJSON: any): ComputedValue {

       if (dataAsJSON['TextExpression'] !== undefined) {
         const computedValue = new TextExpression();
          computedValue.expressionText = dataAsJSON.TextExpression;
          return computedValue;
      }
      if (dataAsJSON['ArithmeticExpression'] !== undefined) { {
        const computedValue = new ArithmeticExpression();
        computedValue.expressionText = dataAsJSON.ArithmeticExpression;
        return computedValue;
      }
  }
  }
}
