import { Injectable } from '@angular/core';
import { DiagramService } from './diagram.service';
import { NumericDataElementCreationService } from './numeric-data-element-creation.service';

@Injectable()
export class IntegerDataElementCreationService extends NumericDataElementCreationService {

  constructor(diagramService: DiagramService) {
    super(diagramService);
    this.elementType = 'IntegerDataElement';
  }

}
