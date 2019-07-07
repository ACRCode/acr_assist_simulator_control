import { DataElementValues } from 'testruleengine/Library/Models/Class';

export class NotCondition {

  conditions: any = [];
  
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
