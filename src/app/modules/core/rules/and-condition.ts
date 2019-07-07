import { ICompositeCondition, DataElementValues } from 'testruleengine/Library/Models/Class';

export class AndCondition implements ICompositeCondition {
  conditions: any = [];
  IsRelevant: boolean;

   conditionType: string;
   constructor() {
     this.conditionType =  'AndCondition';
   }

  evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = true;
    for (let conditionCounter = 0 ;  conditionCounter < this.conditions.length;  conditionCounter++) {
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
