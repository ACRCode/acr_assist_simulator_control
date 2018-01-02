import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';

export class ContainsCondition implements Condition {
  conditionType: ConditionType;

    constructor(conditionType: ConditionType) {
      this.conditionType = conditionType;
    }
   evaluate(value: any): boolean {
    const returnValue = false;
    if (value instanceof Array) {
       return value.indexOf(this.conditionType.comparisonValue) >= 0;
    }
    return returnValue;
  }
}
