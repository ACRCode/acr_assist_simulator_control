import { ConditionType } from './models/conditiontype.model';

export interface Condition {

  conditionType: ConditionType;
  validate(newValue: any): boolean;
}
