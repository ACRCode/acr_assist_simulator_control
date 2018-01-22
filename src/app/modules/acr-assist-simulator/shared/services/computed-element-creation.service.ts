import { Injectable } from '@angular/core';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { ArrayCheckerService } from './array-checker.service';
import { DiagramService } from './diagram.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { ComputedElement } from '../../../core/elements/models/computed-element-model';
import { DecisionPointsCreationService } from './decision-points-creation.service';

@Injectable()
export class ComputedElementCreationService extends DataElementCreationBaseService  {

  constructor(diagramService: DiagramService, private arrayCheckerService: ArrayCheckerService,
    private computedValueCreationService: ComputedValueCreationService ,
    private decisionPointsCreationService: DecisionPointsCreationService) {
    super(diagramService);
    this.elementType = 'ComputedElement';
  }

  createElement(data: any): BaseDataElement {
    const dataElement =  new ComputedElement();
    super.populateBasicData(data, dataElement);
    dataElement.computeValue = this.computedValueCreationService.createComputedValue(data);
    if (data.DecisionPoint) {
      dataElement.decisionPoints = this.decisionPointsCreationService.createDecisionPoints(data.DecisionPoint);
    }
    return dataElement;
  }

}
