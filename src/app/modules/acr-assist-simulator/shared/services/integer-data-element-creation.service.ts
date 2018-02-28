import { Injectable } from '@angular/core';
import { DiagramService } from './diagram.service';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { IntegerDataElement } from '../../../core/elements/models/integer-data-element.model';


@Injectable()
export class IntegerDataElementCreationService extends DataElementCreationBaseService {

  constructor(diagramService: DiagramService) {
    super(diagramService);
    this.elementType = 'IntegerDataElement';
  }

  createElement(data: any): BaseDataElement {
    const dataElement = new IntegerDataElement();
    super.populateBasicData(data, dataElement);
    dataElement.minimum = data.Minimum;
    dataElement.maximum = data.Maximum;
    return dataElement;
  }
}
