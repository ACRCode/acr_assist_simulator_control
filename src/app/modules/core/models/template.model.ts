import { Metadata } from '../metadata/models/metadata-model';
import { BaseDataElement } from '../elements/models/base-data-element.model';
import { Rules } from 'testruleengine/Library/RuleEvaluator';
import { Endpoint } from '../endpoint/endpoint.model';

export class Template {
  metadata: Metadata;
  dataElements: BaseDataElement[];
  rules: Rules;
  templatePartial: string[];
  endPointsString: string[];
  xmlContent: string;
  endpoint: Endpoint;
}
