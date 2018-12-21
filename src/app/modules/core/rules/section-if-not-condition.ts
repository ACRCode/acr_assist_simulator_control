import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';

export class SectionIfNotCondition implements Condition {
    IsRelevant: boolean;
    conditionType: ConditionType;

    constructor(conditionType: ConditionType) {
        this.conditionType = conditionType;
    }

    evaluate(value: any ): boolean  {
        let returnValue = false;
        if (value !== undefined || value != null) {
          returnValue = true;
        }

        return returnValue;
    }
}
