import { ConditionType } from '../models/conditiontype.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';

export class AndCondition implements CompositeCondition {
  conditions: any = [];

   conditionType: string;
   constructor() {
     this.conditionType =  'AndCondition';
   }

  evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = true;
    for (let conditionCounter = 0 ;  conditionCounter < this.conditions.length ;  conditionCounter++) {
      const condition = this.conditions[conditionCounter];
      const executedCondition = condition.evaluate(dataElementValues);
      returnValue = (!executedCondition) ? false :  (returnValue && executedCondition);
      if (!returnValue) {
          break;
      }
    }
    return returnValue;
  }
}
