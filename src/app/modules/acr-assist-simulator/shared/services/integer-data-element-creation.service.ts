import { Injectable } from '@angular/core';
import { DiagramService } from './diagram.service';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { IntegerDataElement } from '../../../core/elements/models/integer-data-element.model';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { NotRelevantDataElements } from '../../../core/models/notrelevantdataelements.model';
import { ConditionalProperty } from '../../../core/elements/models/conditionalproperty.model';


@Injectable()
export class IntegerDataElementCreationService extends DataElementCreationBaseService {

  constructor(diagramService: DiagramService,
    private conditionsCreationService: ConditionsCreationService,
    private computedValueCreationService: ComputedValueCreationService) {
    super(diagramService);
    this.elementType = 'IntegerDataElement';
  }

  createElement(data: any): BaseDataElement {
    const dataElement = new IntegerDataElement();
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
      _conditionalProperty.compositeCondition = this.conditionsCreationService.returnCompositeCondition(conditionalProperty);
    }

    _conditionalProperty.showKeyDiagram = conditionalProperty.ShowKeyDiagram;
    _conditionalProperty.isRelevant = conditionalProperty.IsRelevant;
    _conditionalProperty.isRequired = conditionalProperty.IsRequired;
    _conditionalProperty.DisplaySequence = conditionalProperty.DisplaySequence;
    _conditionalProperty.Minimum = conditionalProperty.Minimum;
    _conditionalProperty.Maximum = conditionalProperty.Maximum;
    return _conditionalProperty;
  }
}
