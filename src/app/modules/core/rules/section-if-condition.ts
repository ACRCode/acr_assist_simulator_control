import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';

export class SectionIfCondition implements Condition {
    IsRelevant: boolean;
    conditionType: ConditionType;

    constructor(conditionType: ConditionType) {
        this.conditionType = conditionType;
    }

    evaluate(dataElementValues: DataElementValues): boolean {
        const value = dataElementValues.get(this.conditionType.dataElementId);
        if (value instanceof Array) {
            return value.length > 0 ? true : false;
        }

        return value !== undefined ? true : false;
    }

    // evaluate(value: any ): boolean  {
    //     let returnValue = false;
    //     if (value !== undefined || value != null) {
    //       returnValue = true;
    //     }

    //     return returnValue;
    // }
}
