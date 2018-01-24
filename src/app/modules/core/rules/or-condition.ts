import { ConditionType } from '../models/conditiontype.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';

export class OrCondition implements CompositeCondition {
  conditions: any[] = [];

  evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = false;
    for (const condition of this.conditions) {
         const executedCondition = condition.evaluate(dataElementValues);
         returnValue = (returnValue || executedCondition);
         if (returnValue) {
           break;
         }
    }
    return returnValue;
  }
}
