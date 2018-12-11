import { ConditionType } from '../models/conditiontype.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';

export class OrCondition implements CompositeCondition {
  conditions: any[] = [];
  IsRelevant: boolean;

  conditionType: string;
  constructor() {
    this.conditionType =  'OrCondition';
  }

  evaluate(dataElementValues: DataElementValues): boolean {

    let returnValue = false;
    for (let conditionCounter = 0 ;  conditionCounter < this.conditions.length ;  conditionCounter++) {
         const condition = this.conditions[conditionCounter];

         const executedCondition = condition.evaluate(dataElementValues);
         returnValue = (returnValue || executedCondition);
         if (returnValue) {
           break;
         }

    }
    return returnValue;
  }
}
