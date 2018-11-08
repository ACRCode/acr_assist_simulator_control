import { Injectable } from '@angular/core';
import { ChoiceDataElementCreationService } from './choice-data-element-creation.service';
import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';

@Injectable()
export class MultipleChoiceDataElementCreationService  extends ChoiceDataElementCreationService {
  constructor(diagramService: DiagramService,  arrayCheckerService: ArrayCheckerService,
     conditionsCreationService: ConditionsCreationService,
     computedValueCreationService: ComputedValueCreationService
    ) {
    super(diagramService, arrayCheckerService, conditionsCreationService, computedValueCreationService);
    this.elementType = 'MultiChoiceDataElement';
  }

}
