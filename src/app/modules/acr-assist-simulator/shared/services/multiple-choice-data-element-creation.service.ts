import { Injectable } from '@angular/core';
import { ChoiceDataElementCreationService } from './choice-data-element-creation.service';
import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';

@Injectable()
export class MultipleChoiceDataElementCreationService  extends ChoiceDataElementCreationService {
  constructor(diagramService: DiagramService,  arrayCheckerService: ArrayCheckerService) {
    super(diagramService, arrayCheckerService);
    this.elementType = 'MultiChoiceDataElement';
  }

}
