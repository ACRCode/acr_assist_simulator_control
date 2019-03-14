import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';
import { NonRelevantPushPopService } from '../../acr-assist-simulator/shared/services/non-relevant-dataelement-register.service';

export class SectionIfCondition implements Condition {
    IsRelevant: boolean;
    conditionType: ConditionType;

    constructor(conditionType: ConditionType) {
        this.conditionType = conditionType;
    }

    evaluate(dataElementValues: DataElementValues): boolean {
        const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
        let isDataElementNotRelevant = false;
        // if (nonRelevantDataElements.indexOf(this.conditionType.dataElementId) !== -1) {
        //     isDataElementNotRelevant = true;
        // }
        if (!isDataElementNotRelevant) {
            const value = dataElementValues.get(this.conditionType.dataElementId);
            if (value instanceof Array) {
                return value.length > 0 ? true : false;
            }

            return value !== undefined && value !== '' ? true : false;
        }

        return false;
    }
}
