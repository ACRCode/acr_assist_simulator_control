import { Injectable } from '@angular/core';
import { DiagramService } from './diagram.service';
import { DataElementCreationBaseService } from './data-element-creation-base-service';
import { GlobalValue, BaseDataElement } from 'testruleengine/Library/Models/Class';

@Injectable()
export class GlobalValueCreationService extends DataElementCreationBaseService {


  createElement(data: any): BaseDataElement {
   const dataElement = new GlobalValue();
   dataElement.id  = data.Attr.Id;
   dataElement.currentValue = data._;
   dataElement.dataElementType = 'GlobalValue';
    return dataElement;
  }

  constructor(diagramService: DiagramService) {
    super(diagramService);
    this.elementType = 'GlobalValue';
  }

}
