import { Metadata } from '../metadata/models/metadata-model';
import { BaseDataElement } from '../elements/models/base-data-element.model';

export class Template {
  metadata: Metadata;
  dataElements: BaseDataElement[];
}
