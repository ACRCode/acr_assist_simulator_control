import { InputData } from "../../../core/models/input-data.model";

export class ChoiceElement {
  elementId: string;
  selectedValue: string;
  selectedText: string;
}

export class NumericElement {
  elementId: string;
  selectedValue: number;
}

export class DateTimeElement {
  elementId: string;
  selectedValue: string;
}

export class TextElement {
  elementId: string;
  selectedValue: string;
}

export class MultiChoiceElement {
  elementId: string;
  selectedValues: string[];
  selectedTexts: string[];
}

export class AllElements {
  elementId: string;
  selectedValues: any[];
}
