import { BaseDataElement } from './base-data-element.model';
import { ImageMap } from './image-map.model';
import { ChoiceInfo } from './choiceInfo.model';

export class ChoiceDataElement extends BaseDataElement  {

  choiceInfo: ChoiceInfo;
  imageMap: ImageMap[];

}
