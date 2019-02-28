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
import { NotRelevantDataElements } from '../../../core/models/notrelevantdataelements.model';
import { ConditionalProperty } from '../../../core/elements/models/conditionalproperty.model';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { Branch } from '../../../core/models/branch.model';

@Injectable()
export class ChoiceDataElementCreationService extends DataElementCreationBaseService {

  constructor(diagramService: DiagramService, private arrayCheckerService: ArrayCheckerService,
    private conditionsCreationService: ConditionsCreationService,
    private computedValueCreationService: ComputedValueCreationService
  ) {
    super(diagramService);
    this.elementType = 'ChoiceDataElement';
  }

  private returnChoice(choiceItem: any): Choice {
    const choice = new Choice();
    choice.label = choiceItem.Label;
    choice.value = choiceItem.Value;
    choice.hint = choiceItem.Hint;
    choice.reportText = choiceItem.ReportText;
    choice.default = false;
    if (choiceItem.Attr && choiceItem.Attr.IsDefault) {
      choice.default = choiceItem.Attr.IsDefault;
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
    dataElement.allowFreetext = data.Attr.AllowFreetext ? data.Attr.AllowFreetext : false;
    const choiceItems = data.ChoiceInfo.Choice;
    let defaultValue: any;
    if (choiceItems !== undefined) {
      dataElement.choiceInfo = new Array<Choice>();
      if (this.arrayCheckerService.isArray(choiceItems)) {
        for (const choiceItem of choiceItems) {
          const choice = this.returnChoice(choiceItem);
          if (choice.default) {
            defaultValue = choice.value;
          }
          dataElement.choiceInfo.push(choice);
        }
      } else {
        const choice = this.returnChoice(choiceItems);
        if (choice.default) {
          defaultValue = choice.value;
        }
        dataElement.choiceInfo.push(choice);
      }
    }
    dataElement.defaultValue = defaultValue;
    dataElement.currentValue = defaultValue;
    const imageMap = data.ImageMap;
    if (imageMap !== undefined) {
      dataElement.imageMap = new ImageMap();
      dataElement.imageMap.location = imageMap.Location;
      const areaMaps = imageMap.Map.Area;
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


    const ConditionalProperties = data.ConditionalProperties;
    if (ConditionalProperties !== undefined) {
      const notRelevantDataElements = new NotRelevantDataElements();
      const dataElementRefs = data.ConditionalProperties;
      // .NotRelevantDataElements.DataElementRef;

      if (data.ConditionalProperties !== undefined) {
        dataElement.conditionalProperties = new Array<ConditionalProperty>();
        if (data.ConditionalProperties.ConditionalProperty instanceof Array) {
          for (const conditionalProperty of data.ConditionalProperties.ConditionalProperty) {
            dataElement.conditionalProperties.push(this.GetConditionalProperties(conditionalProperty));
          }
        } else {
          dataElement.conditionalProperties.push(this.GetConditionalProperties(data.ConditionalProperties.ConditionalProperty));
        }
      }
    }

    return dataElement;
  }

  private GetConditionalProperties(conditionalProperty): ConditionalProperty {
    const _conditionalProperty = new ConditionalProperty();
    _conditionalProperty.condition = this.conditionsCreationService.returnCondition(conditionalProperty);
    // var test = this.computedValueCreationService.createComputedValue(conditionalProperty);
    if (this.conditionsCreationService.isComposite(conditionalProperty)) {
      _conditionalProperty.compositeCondition = this.conditionsCreationService.returnCompositeCondition(conditionalProperty);
    }

    _conditionalProperty.showKeyDiagram = conditionalProperty.ShowKeyDiagram;
    _conditionalProperty.isRelevant = conditionalProperty.IsRelevant;
    _conditionalProperty.isRequired = conditionalProperty.IsRequired;
    _conditionalProperty.DisplaySequence = conditionalProperty.DisplaySequence;
    if (conditionalProperty.ChoiceNotRelevant !== undefined) {
      _conditionalProperty.ChoiceNotRelevant = new Array<string>();
      if (!(conditionalProperty.ChoiceNotRelevant instanceof Array)) {
        conditionalProperty.ChoiceNotRelevant = [conditionalProperty.ChoiceNotRelevant];
      }
      
      for (const choiceNotRelevant of conditionalProperty.ChoiceNotRelevant) {
        _conditionalProperty.ChoiceNotRelevant.push(choiceNotRelevant.Attr.ChoiceValue);
      }
    }

    return _conditionalProperty;
  }
}
