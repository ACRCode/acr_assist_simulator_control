import { Metadata } from '../metadata/models/metadata-model';
import { BaseDataElement } from '../elements/models/base-data-element.model';
import { Rules } from '../rules/models/rules.model';
import { TemplatePartial } from '../endpoint/template-partial';
import { SectionIfValueNotCondition } from '../endpoint/section-if-value-not-condition';
import { Endpoint } from '../endpoint/endpoint.model';

export class Template {
  metadata: Metadata;
  dataElements: BaseDataElement[];
  rules: Rules;
  templatePartial: string[];
  endPointsString: string[];
  xmlContent: string;
  endpoints: Endpoint[];
}
