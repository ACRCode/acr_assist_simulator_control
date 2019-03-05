import { BaseDataElement } from './base-data-element.model';
import { ChoiceInfo } from './choiceInfo.model';
import { ImageMap } from './image-map.model';

 export class MultiChoiceDataElement extends BaseDataElement {
  choiceInfo: ChoiceInfo;
  imageMap: ImageMap[];
  ChoiceNotRelevant: string[];
  allowFreetext = false;
}
