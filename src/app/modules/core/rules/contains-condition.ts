import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';

export class ContainsCondition implements Condition {
  conditionType: ConditionType;
  IsRelevant: boolean;

    constructor(conditionType: ConditionType) {
      this.conditionType = conditionType;
    }

   evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = false;
    const value = dataElementValues.get(this.conditionType.dataElementId);
    if (value !== undefined) {
      for (let counter = 0 ;  counter < value.length ;  counter++) {
        const value1 = value[counter];
        if (value1.toUpperCase() === this.conditionType.comparisonValue.toUpperCase()) {
          returnValue = true;
        }
      }
    }
    return returnValue;
  }
}
