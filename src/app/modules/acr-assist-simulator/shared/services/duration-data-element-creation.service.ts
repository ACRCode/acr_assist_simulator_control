import { Injectable } from '@angular/core';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { DiagramService } from './diagram.service';

import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { NotRelevantDataElements } from '../../../core/models/notrelevantdataelements.model';
import { ConditionalProperty } from '../../../core/elements/models/conditionalproperty.model';
import { DurationDataElement } from '../../../core/elements/models/duration-data-element.model';

@Injectable()
export class DurationDataElementCreationService extends DataElementCreationBaseService {

    constructor(diagramService: DiagramService,
        private conditionsCreationService: ConditionsCreationService,
        private computedValueCreationService: ComputedValueCreationService) {
        super(diagramService);
        this.elementType = 'DurationDataElement';
    }

    createElement(data: any): BaseDataElement {
        const dataElement = new DurationDataElement();
        super.populateBasicData(data, dataElement);

        dataElement.ShowDays = data.Attr != undefined && data.Attr != null ? (data.Attr.ShowDays == undefined ? true : (data.Attr.ShowDays == 'true' ? true : false)) : false;
        dataElement.ShowHours = data.Attr != undefined && data.Attr != null ? (data.Attr.ShowHours == undefined ? true : (data.Attr.ShowHours == 'true' ? true : false)) : false;
        dataElement.ShowMinutes = data.Attr != undefined && data.Attr != null ? (data.Attr.ShowMinutes == undefined ? true : (data.Attr.ShowMinutes == 'true' ? true : false)) : false;
        dataElement.ShowSeconds = data.Attr != undefined && data.Attr != null ? (data.Attr.ShowSeconds == undefined ? true : (data.Attr.ShowSeconds == 'true' ? true : false)) : false;

        dataElement.MinimumDay = data.MinimumDay;
        dataElement.MaximumDay = data.MaximumDay;

        dataElement.MinimumHours = data.MinimumHours;
        dataElement.MaximumHours = data.MaximumHours;

        dataElement.MinimumMinutes = data.MinimumMinutes;
        dataElement.MaxmimumMinutes = data.MaxmimumMinutes;

        dataElement.MinimumSeconds = dataElement.MinimumSeconds;
        dataElement.MaxmimumSeconds = dataElement.MaxmimumSeconds;

        dataElement.MinimumDayOverrider = data.MinimumDay;
        dataElement.MaximumDayOverrider = data.MaximumDay;

        dataElement.MinimumHoursOverrider = data.MinimumHours;
        dataElement.MaximumHoursOverrider = data.MaximumHours;

        dataElement.MinimumMinutesOverrider = data.MinimumMinutes;
        dataElement.MaxmimumMinutesOverrider = data.MaxmimumMinutes;

        dataElement.MinimumSecondsOverrider = data.MinimumMinutes;
        dataElement.MaxmimumSecondsOverrider = data.MaxmimumMinutes;      

        const ConditionalProperties = data.ConditionalProperties;
        if (ConditionalProperties !== undefined) {
          const notRelevantDataElements = new NotRelevantDataElements();
          const dataElementRefs = data.ConditionalProperties;
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

        _conditionalProperty.isRelevant = conditionalProperty.IsRelevant;
        _conditionalProperty.isRequired = conditionalProperty.IsRequired;
        _conditionalProperty.DisplaySequence = conditionalProperty.DisplaySequence;

        _conditionalProperty.MinimumDay = conditionalProperty.MinimumDay;
        _conditionalProperty.MaximumDay = conditionalProperty.MaximumDay;
        _conditionalProperty.MinimumHours = conditionalProperty.MinimumHours;
        _conditionalProperty.MaximumHours = conditionalProperty.MaximumHours;
        _conditionalProperty.MaxmimumMinutes = conditionalProperty.MaximumHours;
        _conditionalProperty.MinimumMinutes = conditionalProperty.MinimumHours;
        _conditionalProperty.MinimumMinutes = conditionalProperty.MinimumHours;

        _conditionalProperty.MinimumSeconds = conditionalProperty.MinimumSeconds;
        _conditionalProperty.MaxmimumSeconds = conditionalProperty.MaxmimumSeconds;
        return _conditionalProperty;
      }
}
