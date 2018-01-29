import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';

export class GreaterThanCondition implements Condition {
  conditionType: ConditionType;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const value = +dataElementValues.get(this.conditionType.dataElementId) as number;
    let comparisonValue =  -1;
    if (isNaN(this.conditionType.comparisonValue))  {
      comparisonValue = + dataElementValues.get(this.conditionType.comparisonValue) as number;
    } else {
      comparisonValue =  + this.conditionType.comparisonValue as number;
    }
    return value > comparisonValue;
  }

}
