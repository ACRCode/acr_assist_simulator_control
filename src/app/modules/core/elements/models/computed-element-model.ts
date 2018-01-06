import { BaseDataElement } from './base-data-element.model';
import { ComputedValue } from '../../models/computed-value.model';
import { DecisionPoint } from '../../models/decisionpoint.model';

export class ComputedElement  extends BaseDataElement {

    computeValue: ComputedValue;
    decisionPoints: DecisionPoint[];

}
