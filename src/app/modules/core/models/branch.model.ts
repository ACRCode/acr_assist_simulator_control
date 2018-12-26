import { NotRelevantDataElements } from './notrelevantdataelements.model';
import { CompositeCondition } from '../composite-condition';
import { Condition } from '../condition';
import { DecisionPoint } from './decisionpoint.model';
import { EndPointRef } from './endpointref.model';
import { ComputedValue } from './computed-value.model';
import { TextTemplateContent } from '../endpoint/text-template-content.model';
import { ReportText } from '../endpoint/report-text.model';

export class Branch {
  label: string;
  notRelevantDataElements: NotRelevantDataElements;
  compositeCondition: CompositeCondition;
  condition: Condition;
  decisionPoints: DecisionPoint[];
  endPointRef: EndPointRef;
  computedValue: ComputedValue;
  textTemplateContent: TextTemplateContent;
  branches: Branch[] = [];
  texts: TextTemplateContent[] = [];
  reportText: ReportText[] = [];
  constructor() {
    // this.textTemplateContent = new TextTemplateContent();
  }
}
