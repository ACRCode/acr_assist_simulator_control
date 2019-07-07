import { DataElementValues, ConditionType, NonRelevantPushPopService } from 'testruleengine/Library/Models/Class';


export class ContainsCondition {

  conditionType: ConditionType;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = false;
    const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
    let isDataElementNotRelevant = false;

    if (!isDataElementNotRelevant) {
      const value = dataElementValues.get(this.conditionType.dataElementId);
      if (value !== undefined) {
        for (let counter = 0; counter < value.length; counter++) {
          const value1 = value[counter];
          if (value1.toUpperCase() === this.conditionType.comparisonValue.toUpperCase()) {
            returnValue = true;
          }
        }
      }
    }
    return returnValue;
  }
}
