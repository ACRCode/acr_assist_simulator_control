import {ConditionType} from '../models/conditiontype.model';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';
export class EqualCondition implements Condition {
  IsRelevant: boolean;

  conditionType: ConditionType;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const value = dataElementValues.get(this.conditionType.dataElementId);
    if (value !== undefined) {
      return value.toUpperCase() === this.conditionType.comparisonValue.toUpperCase();
    }

    return false;
  }

}
