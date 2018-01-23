import { ConditionType } from '../models/conditiontype.model';
import { Condition } from '../condition';
import { DataElementValues } from '../dataelementvalues';
import { SectionIfCondition } from './section-if-condition';
import { SectionIfValueNotCondition } from './section-if-value-not-condition';

export class SectionIfValueCondition implements Condition {
  conditionType: ConditionType;
  sectionIf: SectionIfValueCondition[];
  innerSectionIfValue: SectionIfCondition;
  innerSectionIfValueNot: SectionIfValueNotCondition;
  sectionText: string;

  constructor(conditionType: ConditionType) {
    this.conditionType = conditionType;
  }

  evaluate(dataElementValues: DataElementValues): boolean {
    const value = dataElementValues.get(this.conditionType.dataElementId);
    return value === this.conditionType.comparisonValue;
  }
}
