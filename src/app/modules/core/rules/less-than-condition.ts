import { DataElementValues, ConditionType, NonRelevantPushPopService } from 'testruleengine/Library/Models/Class';
import { ICondition } from 'testruleengine/Library/Models/Interface';

export class LessThanCondition implements ICondition {
  conditionType: ConditionType;
  IsRelevant: boolean;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }
  evaluate(dataElementValues: DataElementValues): boolean {
    const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
    let isDataElementNotRelevant = false;

    if (!isDataElementNotRelevant) {

      const value = +dataElementValues.get(this.conditionType.dataElementId) as number;
      let comparisonValue = -1;
      if (isNaN(this.conditionType.comparisonValue)) {
        comparisonValue = + dataElementValues.get(this.conditionType.comparisonValue) as number;
      } else {
        comparisonValue = + this.conditionType.comparisonValue as number;
      }
      return value < comparisonValue;
    }

    return false;
  }
}
