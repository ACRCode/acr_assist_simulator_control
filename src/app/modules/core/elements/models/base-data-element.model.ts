import { Diagram } from '../../models/diagram.model';

export  class BaseDataElement {
  id: string;
  isRequired: boolean;
  displaySequence: number;
  label: string;
  hint: string;
  diagrams: Diagram[];
  voiceCommand: String;
  currentValue: any;
  dataElementType: string;
  isVisible: Boolean = true;
}
