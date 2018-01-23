import { Condition } from './condition';
import { DataElementValues } from './dataelementvalues';

export interface CompositeCondition {
  conditions: any[] ;
  evaluate(dataElementValues: DataElementValues): boolean;

}
