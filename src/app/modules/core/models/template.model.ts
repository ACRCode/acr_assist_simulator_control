import { Metadata } from '../metadata/models/metadata-model';
import { BaseDataElement } from '../elements/models/base-data-element.model';
import { Rules } from '../rules/models/rules.model';

export class Template {
  metadata: Metadata;
  dataElements: BaseDataElement[];
  rules: Rules;
}
