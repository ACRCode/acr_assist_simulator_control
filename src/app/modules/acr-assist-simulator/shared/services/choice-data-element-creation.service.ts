import { Injectable } from '@angular/core';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { DiagramService } from './diagram.service';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { Choice } from '../../../core/elements/models/choice.model';
import { ImageMap } from '../../../core/elements/models/image-map.model';
import { Area } from '../../../core/elements/models/area-model';
import { AreaMap } from '../../../core/elements/models/area-map.model';
import { ArrayCheckerService } from './array-checker.service';

@Injectable()
export class ChoiceDataElementCreationService extends DataElementCreationBaseService {
  constructor(diagramService: DiagramService, private arrayCheckerService: ArrayCheckerService) {
    super(diagramService);
    this.elementType = 'ChoiceDataElement';
  }



  private returnChoice(choiceItem: any): Choice {
    const choice = new Choice();
    choice.label = choiceItem.Label;
    choice.value = choiceItem.Value;
    choice.hint = choiceItem.Hint;
    choice.default = false;
    if (choiceItem.Attr &&  choiceItem.Attr.Default) {
      choice.default = choiceItem.Attr.Default;
    }
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
    let defaultValue: any;
    if (choiceItems !== undefined) {
      dataElement.choiceInfo = new Array<Choice>();
      if (this.arrayCheckerService.isArray(choiceItems)) {
        for (const choiceItem of choiceItems) {
          const choice =  this.returnChoice(choiceItem);
          if (choice.default) {
            defaultValue =  choice.value;
          }
          dataElement.choiceInfo.push(choice);
        }
      } else {
        const choice =  this.returnChoice(choiceItems);
          if (choice.default) {
            defaultValue =  choice.value;
          }
        dataElement.choiceInfo.push(choice);
      }
    }
    dataElement.currentValue = defaultValue;
    const imageMap = data.ImageMap;
    if (imageMap !== undefined) {
      dataElement.imageMap = new ImageMap();
      dataElement.imageMap.location = imageMap.Location;
      const areaMaps =   imageMap.Map.Area;
      if (areaMaps !== undefined) {
        dataElement.imageMap.map = new AreaMap();
        dataElement.imageMap.map.areas = new Array<Area>();
        if (this.arrayCheckerService.isArray(areaMaps)) {
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
