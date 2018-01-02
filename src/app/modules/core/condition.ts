import { ConditionType } from './models/conditiontype.model';

export interface Condition {
  readonly conditionType: ConditionType;
  evaluate(value: any): boolean;
}
