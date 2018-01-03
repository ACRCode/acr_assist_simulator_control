import { Injectable } from '@angular/core';
import { ChoiceDataElementCreationService } from './choice-data-element-creation.service';
import { DiagramService } from './diagram.service';

@Injectable()
export class MultipleChoiceDataElementCreationService  extends ChoiceDataElementCreationService {
  constructor(diagramService: DiagramService) {
    super(diagramService);
    this.elementType = 'MultiChoiceDataElement';
  }

}
