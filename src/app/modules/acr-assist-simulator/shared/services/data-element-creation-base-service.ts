import { DataElementCreationService } from './dataelement-creation-service';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { Diagram } from '../../../core/models/diagram.model';
import { Injectable } from '@angular/core';
import { DiagramService } from './diagram.service';

@Injectable()
export abstract class DataElementCreationBaseService implements DataElementCreationService {
  elementType: string;
  abstract  createElement(data: any): BaseDataElement;
  constructor(private diagramService: DiagramService) {

  }

  private  returnDiagram(diagramJSON: any ): Diagram {
    const metadataDiagram = new Diagram();
    metadataDiagram.displaySequence = diagramJSON.Attr.DisplaySequence;
    metadataDiagram.keyDiagram = diagramJSON.Attr.KeyDiagram ?  diagramJSON.Attr.KeyDiagram : false;
    metadataDiagram.label = diagramJSON.Label;
    metadataDiagram.location = diagramJSON.Location;
    return metadataDiagram;
  }

  populateBasicData(data: any, dataElement: BaseDataElement) {

    dataElement.dataElementType = this.elementType;
    dataElement.displaySequence = data.Attr.DisplaySequence;
    dataElement.id = data.Attr.Id;
    dataElement.isRequired = data.Attr.IsRequired;
    dataElement.label = data.Label;
    dataElement.hint = data.Hint;
    if (data.Diagrams) {
       dataElement.diagrams = this.diagramService.returnDiagrams(data.Diagrams.Diagram);
    }
    dataElement.currentValue = undefined;
  }

}
