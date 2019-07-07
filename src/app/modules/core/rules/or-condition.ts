import { DataElementValues } from 'testruleengine/Library/Models/Class';
import { ICompositeCondition } from 'testruleengine/Library/Models/Interface';


export class OrCondition implements ICompositeCondition {
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
