import { ConditionType } from '../models/conditiontype.model';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';
import * as _ from 'lodash';
import { NonRelevantPushPopService } from '../../acr-assist-simulator/shared/services/non-relevant-dataelement-register.service';

export class EqualCondition implements Condition {
  IsRelevant: boolean;

  conditionType: ConditionType;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
    let isDataElementNotRelevant = false;
    if (nonRelevantDataElements.indexOf(this.conditionType.dataElementId) !== -1) {
      isDataElementNotRelevant = true;
    }
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
