import { DataElementValues } from 'testruleengine/Library/Models/Class';
import { ICompositeCondition } from 'testruleengine/Library/Models/Interface';


export class NotCondition implements ICompositeCondition {
  conditions: any = [];
  IsRelevant: boolean;
  
  conditionType: string;
  constructor() {
    this.conditionType =  'NotCondition';
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const  results = new Array<boolean>();
    for (const condition of this.conditions) {
      results.push(condition.evaluate(dataElementValues));
    }
    return !(results[0]);
  }
}
