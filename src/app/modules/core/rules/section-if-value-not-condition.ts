import { Condition } from '../condition';
import { ConditionType } from '../models/conditiontype.model';
import { DataElementValues } from '../dataelementvalues';
import { SectionIfValueCondition } from './section-if-value-condition';


export class SectionIfValueNotCondition implements Condition {
  IsRelevant: boolean;
  conditionType: ConditionType;
  sectionIfValue: SectionIfValueCondition[];
  sectionIfValueNot: SectionIfValueNotCondition[];

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const value = dataElementValues.get(this.conditionType.dataElementId);
    return value !== this.conditionType.comparisonValue;
  }
}
