import { Condition } from './condition';
import { ConditionType } from './models/conditiontype.model';

export class LessThanOrEqualsCondition implements Condition {
  conditionType: ConditionType;

  validate(newValue: any): boolean {
    return newValue <= this.conditionType.comparisonValue;
  }

}
