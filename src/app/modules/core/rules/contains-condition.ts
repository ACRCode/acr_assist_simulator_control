import { Condition } from './condition';
import { ConditionType } from './models/conditiontype.model';

export class LessThanOrEqualsCondition implements Condition {
  conditionType: ConditionType;

  validate(newValue: any): boolean {
    const returnValue = false;
    if (newValue instanceof Array){
       return newValue.indexOf(this.conditionType.comparisonValue) >= 0;
    }
    return returnValue;
  }

}
