import { CompositeCondition } from '../composite-condition';
import { DataElementValues } from '../dataelementvalues';

export class NotCondition implements CompositeCondition {
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
