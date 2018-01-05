import { ConditionType } from '../models/conditiontype.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';

export class AndCondition implements CompositeCondition {
  conditions: any[] = [];




  evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = true;
    for (const arrayCounter = 0 ; arrayCounter < this.conditions.length ; arrayCounter) {
         const condition = this.conditions[arrayCounter];
         const executedCondition = condition.evaluate(dataElementValues);
         returnValue = (!executedCondition) ? false :  (returnValue && executedCondition);
         if (!returnValue) {
             break;
         }
    }
    return returnValue;
  }
}
