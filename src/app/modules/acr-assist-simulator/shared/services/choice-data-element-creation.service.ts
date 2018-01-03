import { Injectable } from '@angular/core';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { DiagramService } from './diagram.service';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { Choice } from '../../../core/elements/models/choice.model';
import { ImageMap } from '../../../core/elements/models/image-map.model';
import { Area } from '../../../core/elements/models/area-model';
import { AreaMap } from '../../../core/elements/models/area-map.model';

@Injectable()
export class ChoiceDataElementCreationService extends DataElementCreationBaseService {
  constructor(diagramService: DiagramService) {
    super(diagramService);
    this.elementType = 'ChoiceDataElement';
  }

  private isArray(item: any): boolean {
    return Object.prototype.toString.call(item) === '[object Array]';
  }

  private returnChoice(choiceItem: any): Choice {
    const choice = new Choice();
    choice.label = choiceItem.Label;
    choice.value = choiceItem.Value;
    choice.hint = choiceItem.Hint;
    choice.default = false;
    return choice;
  }

  private returnArea(areaJSON: any): Area {
    const area = new Area();
    area.choiceValue = areaJSON.Attr.ChoiceValue;
    area.coords = areaJSON.Attr.Coords;
    area.shape = areaJSON.Attr.Shape;
    return area;
  }


  createElement(data: any): BaseDataElement {
    const dataElement = new ChoiceDataElement();
    super.populateBasicData(data, dataElement);
    const choiceItems = data.ChoiceInfo.Choice;
    if (choiceItems !== undefined) {
      dataElement.choiceInfo = new Array<Choice>();
      if (this.isArray(choiceItems)) {
        for (const choiceItem of choiceItems) {
          dataElement.choiceInfo.push(this.returnChoice(choiceItem));
        }
      } else {
        dataElement.choiceInfo.push(this.returnChoice(choiceItems));
      }
    }

    const imageMap = data.ImageMap;
    if (imageMap !== undefined) {
      dataElement.imageMap = new ImageMap();
      dataElement.imageMap.location = imageMap.Location;
      const areaMaps =   imageMap.Map.Area;
      if (areaMaps !== undefined) {
        dataElement.imageMap.map = new AreaMap();
        dataElement.imageMap.map.areas = new Array<Area>();
        if (this.isArray(areaMaps)) {
          for (const areaMap of areaMaps) {
            dataElement.imageMap.map.areas.push(this.returnArea(areaMap));
          }
        } else {
          dataElement.imageMap.map.areas.push(this.returnArea(areaMaps));
        }
      }
    }
    return dataElement;
  }
}
