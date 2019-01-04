import { Diagram } from '../../models/diagram.model';
import { ConditionalProperty } from './conditionalproperty.model';
import { CodableConcept } from './codableConcept.model';

export  class BaseDataElement {
  id: string;
  isRequired: Boolean = true;
  displaySequence: number;
  label: string;
  hint: string;
  diagrams: Diagram[];
  voiceCommand: String;
  currentValue: any;
  dataElementType: string;
  isVisible: Boolean = true;
  defaultValue: any;
  cdeId: string;
  conditionalProperties: ConditionalProperty[];
  isEditable: Boolean = true;
  hasprefilled: Boolean = false;
  output: Boolean = false;
  unit: string;
  sourceFilled: string;
  codableConcept: CodableConcept;

  isRequiredOverrider: Boolean = true;
  displaySequenceOverrider: number;

  isRepeatable: boolean;
  repeatGroup: string;
  repeatRefID: string;
  isManuallyAdded: boolean;
}
