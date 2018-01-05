import { ConditionType } from '../models/conditiontype.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';

export class OrCondition implements CompositeCondition {
  conditions: any[] = [];

  evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = false;
    for (const arrayCounter = 0 ; arrayCounter < this.conditions.length ; arrayCounter) {
         const condition = this.conditions[arrayCounter];
         const executedCondition = condition.evaluate(dataElementValues);
         returnValue = (returnValue || executedCondition);
    }
    return returnValue;
  }
}
