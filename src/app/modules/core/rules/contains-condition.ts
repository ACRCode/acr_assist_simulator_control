import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';

export class ContainsCondition implements Condition {
  conditionType: ConditionType;

    constructor(conditionType: ConditionType) {
      this.conditionType = conditionType;
    }

   evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = false;
    const value = dataElementValues.get(this.conditionType.dataElementId);
    if (value !== undefined) {
      returnValue =  value.indexOf(this.conditionType.comparisonValue) >= 0;
    }
    return returnValue;
  }
}
