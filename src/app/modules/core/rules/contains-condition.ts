import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';

export class ContainsCondition implements Condition {
  conditionType: ConditionType;

    constructor(conditionType: ConditionType) {
      this.conditionType = conditionType;
    }

   evaluate(dataElementValues: DataElementValues): boolean {
    const returnValue = false;
    const value = dataElementValues.get(this.conditionType.dataElementId);
    if (value instanceof Array) {
       return value.indexOf(this.conditionType.comparisonValue) >= 0;
    }
    return returnValue;
  }
}
