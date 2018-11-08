import { Condition } from './condition';
import { DataElementValues } from './dataelementvalues';

export interface CompositeCondition {
  conditionType: string;
  conditions: any[] ;
  IsRelevant: boolean;
  evaluate(dataElementValues: DataElementValues): boolean;
}
