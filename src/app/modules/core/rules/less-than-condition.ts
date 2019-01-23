import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';
import { NonRelevantPushPopService } from '../../acr-assist-simulator/shared/services/non-relevant-dataelement-register.service';

export class LessThanCondition implements Condition {
  conditionType: ConditionType;
  IsRelevant: boolean;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }
  evaluate(dataElementValues: DataElementValues): boolean {
    const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
    let isDataElementNotRelevant = false;
    // if (nonRelevantDataElements.indexOf(this.conditionType.dataElementId) !== -1) {
    //   isDataElementNotRelevant = true;
    // }
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
