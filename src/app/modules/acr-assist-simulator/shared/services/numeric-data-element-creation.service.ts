import { Injectable } from '@angular/core';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { DiagramService } from './diagram.service';
import { BaseDataElement, NumericDataElement, ConditionalProperty, NotRelevantDataElements } from 'testruleengine/Library/Models/Class';
import { ConditionsCreationService } from './conditions-creation.service';
import { Subscription } from 'rxjs'

@Injectable()
export class NumericDataElementCreationService extends DataElementCreationBaseService {
  subscription: Subscription;
  constructor(diagramService: DiagramService,
    private conditionsCreationService: ConditionsCreationService
    ) {
    super(diagramService);
    this.elementType = 'NumericDataElement';
  }

  createElement(data: any): BaseDataElement {
    const dataElement = new NumericDataElement();
    super.populateBasicData(data, dataElement);
    dataElement.minimum = data.Minimum;
    dataElement.maximum = data.Maximum;

    dataElement.maximumOverrider = data.Maximum;
    dataElement.minimumOverrider = data.Minimum;

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
      _conditionalProperty.ICompositeCondition = this.conditionsCreationService.returnICompositeCondition(conditionalProperty);
    }

    _conditionalProperty.isRelevant = conditionalProperty.IsRelevant;
    _conditionalProperty.isRequired = conditionalProperty.IsRequired;
    _conditionalProperty.DisplaySequence = conditionalProperty.DisplaySequence;
    _conditionalProperty.Minimum = conditionalProperty.Minimum;
    _conditionalProperty.Maximum = conditionalProperty.Maximum;
    return _conditionalProperty;
  }

}
