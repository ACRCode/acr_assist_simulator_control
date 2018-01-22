import { Condition } from './condition';
import { DataElementValues } from './dataelementvalues';

export interface CompositeCondition {
  readonly conditions: any[] ;
  evaluate(dataElementValues: DataElementValues): boolean;

}
