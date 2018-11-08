import { ConditionType } from './models/conditiontype.model';
import { DataElementValues } from './dataelementvalues';

export interface Condition {
  readonly conditionType: ConditionType;
  IsRelevant: boolean;
  evaluate(dataElementValues: DataElementValues): boolean;
}
