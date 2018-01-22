import { Injectable } from '@angular/core';
import { DiagramService } from './diagram.service';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { GlobalValue } from '../../../core/elements/models/globalvalue.model';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';

@Injectable()
export class GlobalValueCreationService extends DataElementCreationBaseService {


  createElement(data: any): BaseDataElement {
   const dataElement = new GlobalValue();
   dataElement.id  = data.Attr.Id;
   dataElement.value = data._;
    return dataElement;
  }

  constructor(diagramService: DiagramService) {
    super(diagramService);
    this.elementType = 'GlobalValue';
  }

}
