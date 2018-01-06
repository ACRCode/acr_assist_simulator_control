import { Injectable } from '@angular/core';
import { TextExpression } from '../../../core/models/text-expression.model';
import { ComputedValue } from '../../../core/models/computed-value.model';
import { ArithmeticExpression } from '../../../core/models/arithmetic-expression.model';

@Injectable()
export class ComputedValueCreationService {

  constructor() { }

  createComputedValue(dataAsJSON: any): ComputedValue {

       if (dataAsJSON.hasOwnProperty('TextExpression')) {
          const computedValue = new TextExpression();
          computedValue.expressionText = dataAsJSON.TextExpression;
          return computedValue;
      } else  if (dataAsJSON.hasOwnProperty('ArithmeticExpression')) { {
        const computedValue = new ArithmeticExpression();
        computedValue.expressionText = dataAsJSON.ArithmeticExpression;
        return computedValue;
      }
  }
  }
}
