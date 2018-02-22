import { BaseDataElement } from './base-data-element.model';
import { ImageMap } from './image-map.model';
import { ChoiceInfo } from './choiceInfo.model';
import { Choice } from './choice.model';

export class ChoiceDataElement extends BaseDataElement  {

  choiceInfo: Choice[];
  imageMap: ImageMap;
  allowFreetext = false;

}
