import { Condition, DataElementValues, ConditionType, NonRelevantPushPopService } from 'testruleengine/Library/RuleEvaluator';

import * as _ from 'lodash';

export class EqualCondition implements Condition {
  IsRelevant: boolean;

  conditionType: ConditionType;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
    let isDataElementNotRelevant = false;

    if (!isDataElementNotRelevant) {
      const value = dataElementValues.get(this.conditionType.dataElementId);
      if (value !== undefined) {
        if (value instanceof Array) {
          for (const $value of value) {
            if ($value.toUpperCase() === this.conditionType.comparisonValue.toUpperCase()) {
              return true;
            }
          }
        } else {
          return value.toUpperCase() === this.conditionType.comparisonValue.toUpperCase();
        }
      }
    }

    return false;
  }
}
