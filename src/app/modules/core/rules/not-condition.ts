import { CompositeCondition, DataElementValues } from 'testruleengine/Library/RuleEvaluator';

export class NotCondition implements CompositeCondition {
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
