import { NotRelevantDataElements } from './models/notrelevantdataelements.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';
import { DecisionPoint } from './decisionpoint.model';
import { EndPointRef } from './models/endpointref.model';

export class Branch {

  label: string;
  notRelevantDataElements: NotRelevantDataElements[];
  compositeCondition: CompositeCondition;
  condition: Condition;
  decisionPoints: DecisionPoint[];
  endPointRef: EndPointRef;
}
