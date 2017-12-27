import {ConditionType} from './models/conditiontype.model';
import { Condition } from './condition';
export class EqualCondition implements Condition {

  conditionType: ConditionType;

  validate(currentValue: string): boolean {
    return currentValue === this.conditionType.comparisonValue;
  }

}
