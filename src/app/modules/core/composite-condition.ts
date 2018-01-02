import { Condition } from './condition';

export interface CompositeCondition {
  readonly conditions: Condition[];
  evaluate(values: any[]): boolean;

}
