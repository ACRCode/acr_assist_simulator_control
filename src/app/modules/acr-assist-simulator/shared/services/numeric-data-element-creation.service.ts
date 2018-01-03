import { Injectable } from '@angular/core';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { DiagramService } from './diagram.service';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';

@Injectable()
export class NumericDataElementCreationService extends DataElementCreationBaseService {

  constructor(diagramService: DiagramService) {
    super(diagramService);
    this.elementType = 'NumericDataElement';
  }

  createElement(data: any): BaseDataElement {
    const dataElement = new NumericDataElement();
    super.populateBasicData(data, dataElement);
    dataElement.minimum = data.Minimum;
    dataElement.maximum = data.Maximum;
    return dataElement;
  }



}
