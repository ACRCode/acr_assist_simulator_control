import { Condition } from './condition';
import { DataElementValues } from './dataelementvalues';

export interface CompositeCondition {
  conditionType: string;
  conditions: any[] ;
  evaluate(dataElementValues: DataElementValues): boolean;

}
