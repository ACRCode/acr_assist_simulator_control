import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';


export class SectionIfValueCondition implements Condition {
  conditionType: ConditionType;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const value = dataElementValues.get(this.conditionType.dataElementId);
    return value !== this.conditionType.comparisonValue;
  }
}
