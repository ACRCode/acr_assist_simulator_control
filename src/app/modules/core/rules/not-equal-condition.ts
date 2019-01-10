import { ConditionType } from '../models/conditiontype.model';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';
export class NotEqualCondition implements Condition {

  conditionType: ConditionType;
  IsRelevant: boolean;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const value = dataElementValues.get(this.conditionType.dataElementId);
    let isExist = false;
    if (value !== undefined) {
      if (value instanceof Array) {
        for (const $value of value) {
          if ($value.toUpperCase() === this.conditionType.comparisonValue.toUpperCase()) {
            isExist = true;
          }
        }

        return isExist ? false : true;
      } else {
        return value.toUpperCase() !== this.conditionType.comparisonValue.toUpperCase();
      }
    }

    // if (value !== undefined) {
    //   return value.toUpperCase() !== this.conditionType.comparisonValue.toUpperCase();
    // }

    return false;
  }
}
