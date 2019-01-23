import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';
import { NonRelevantPushPopService } from '../../acr-assist-simulator/shared/services/non-relevant-dataelement-register.service';

export class ContainsCondition implements Condition {
  conditionType: ConditionType;
  IsRelevant: boolean;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    let returnValue = false;
    const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
    let isDataElementNotRelevant = false;
    if (nonRelevantDataElements.indexOf(this.conditionType.dataElementId) !== -1) {
      isDataElementNotRelevant = true;
    }
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
