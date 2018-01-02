import { ConditionType } from '../models/conditiontype.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';

export class AndCondition implements CompositeCondition {
  conditions: Condition[];

  constructor(conditions: Condition[]) {
    this.conditions = conditions;
  }

   evaluate(values: any[]): boolean {
    let returnValue = true;
    for (const arrayCounter = 0 ; arrayCounter < this.conditions.length ; arrayCounter) {
           const executedCondition = this.conditions[0].evaluate(values[arrayCounter]);
           returnValue = (!executedCondition) ? false :  (returnValue && executedCondition);
           if (!returnValue) {
                break;
           }
    }
    return returnValue;
  }
}
