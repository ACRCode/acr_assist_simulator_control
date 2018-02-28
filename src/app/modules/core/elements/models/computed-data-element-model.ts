import { BaseDataElement } from './base-data-element.model';
import { ComputedValue } from '../../models/computed-value.model';
import { DecisionPoint } from '../../models/decisionpoint.model';
import { Branch } from '../../models/branch.model';

export class ComputedDataElement  extends BaseDataElement {

    computeValue: ComputedValue;
    decisionPoints: DecisionPoint[];
    defaultBranch: Branch;

}
