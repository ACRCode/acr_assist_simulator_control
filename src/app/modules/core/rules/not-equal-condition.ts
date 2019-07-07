import { DataElementValues, ConditionType, NonRelevantPushPopService } from 'testruleengine/Library/Models/Class';
import { ICondition } from 'testruleengine/Library/Models/Interface';


export class NotEqualCondition implements ICondition {

  conditionType: ConditionType;
  IsRelevant: boolean;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
    let isDataElementNotRelevant = false;

    if (!isDataElementNotRelevant) {
      const value = dataElementValues.get(this.conditionType.dataElementId);
      let isExist = false;
      if (value !== undefined) {
        if (value instanceof Array) {
          for (const $value of value) {
            if ($value.toUpperCase() === this.conditionType.comparisonValue.toUpperCase()) {
              isExist = true;
            }
          }

          return isExist ? false : true;
        } else {
          return value.toUpperCase() !== this.conditionType.comparisonValue.toUpperCase();
        }
      }
    }

    return false;
  }
}
