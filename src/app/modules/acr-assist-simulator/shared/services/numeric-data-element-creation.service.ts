import { Injectable } from '@angular/core';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { DiagramService } from './diagram.service';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';
import { ConditionalProperty } from '../../../core/elements/models/conditionalproperty.model';
import { ConditionsCreationService } from './conditions-creation.service';
import { NotRelevantDataElements } from '../../../core/models/notrelevantdataelements.model';
import { ComputedValueCreationService } from './computed-value-creation.service';

@Injectable()
export class NumericDataElementCreationService extends DataElementCreationBaseService {

  constructor(diagramService: DiagramService,
    private conditionsCreationService: ConditionsCreationService,
    private computedValueCreationService: ComputedValueCreationService) {
    super(diagramService);
    this.elementType = 'NumericDataElement';
  }

  createElement(data: any): BaseDataElement {
    const dataElement = new NumericDataElement();
    super.populateBasicData(data, dataElement);
    dataElement.minimum = data.Minimum;
    dataElement.maximum = data.Maximum;

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

    console.log(dataElement);
    return dataElement;
  }

  private GetConditionalProperties(conditionalProperty): ConditionalProperty {
    const _conditionalProperty = new ConditionalProperty();
    _conditionalProperty.condition = this.conditionsCreationService.returnCondition(conditionalProperty);
    var test = this.computedValueCreationService.createComputedValue(conditionalProperty);
    if (this.conditionsCreationService.isComposite(conditionalProperty)) {
      _conditionalProperty.compositeCondition = this.conditionsCreationService.returnCompositeCondition(conditionalProperty);
    }
    
    _conditionalProperty.isRelevant = conditionalProperty.IsRelevant;
    _conditionalProperty.isRequired = conditionalProperty.IsRequired;
    _conditionalProperty.DisplaySequence = conditionalProperty.DisplaySequence;
    return _conditionalProperty;
  }

}
