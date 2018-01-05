import { ConditionType } from './models/conditiontype.model';
import { DataElementValues } from './dataelementvalues';

export interface Condition {
  readonly conditionType: ConditionType;
  evaluate(dataElementValues: DataElementValues): boolean;
}
