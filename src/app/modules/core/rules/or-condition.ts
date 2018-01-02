import { ConditionType } from '../models/conditiontype.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';

export class OrCondition implements CompositeCondition {
  conditions: Condition[];
  constructor(conditions: Condition[]) {
    this.conditions = conditions;
  }
  evaluate(value: any[]): boolean {
    let returnValue = false;
    for (const arrayCounter = 0 ; arrayCounter < this.conditions.length ; arrayCounter) {
           const executedCondition = this.conditions[0].evaluate(value[arrayCounter]);
           returnValue = (returnValue || executedCondition);
    }
    return returnValue;
  }
}
