import { DataElementCreationService } from './dataelement-creation-service';
import { BaseDataElement, CodableConcept, Coding } from 'testruleengine/Library/Models/Class';
import { Injectable } from '@angular/core';
import { DiagramService } from './diagram.service';

@Injectable()
export abstract class DataElementCreationBaseService implements DataElementCreationService {

  elementType: string;
  abstract createElement(data: any): BaseDataElement;

  constructor(
    private diagramService: DiagramService) {
  }

  populateBasicData(data: any, dataElement: BaseDataElement) {
    dataElement.dataElementType = this.elementType;
    dataElement.displaySequence = data.Attr.DisplaySequence;
    dataElement.id = data.Attr.Id;
    dataElement.isRequired = data.Attr.IsRequired === 'true' ? true : false;
    dataElement.label = data.Label;
    dataElement.hint = data.Hint;
    dataElement.cdeId = data.Attr.CdeId;
    if (data.Diagrams) {
      dataElement.diagrams = this.diagramService.returnDiagrams(data.Diagrams.Diagram);
    }
    dataElement.currentValue = undefined;
    dataElement.defaultValue = undefined;
    dataElement.isEditable = data.Attr.Editable === 'false' ? false : true;
    dataElement.hasprefilled = data.Attr.Hasprefilled === 'true' ? true : false;
    dataElement.output = data.Attr.Output === 'true' ? true : false;
    dataElement.unit = data.Attr.Unit !== undefined ? data.Attr.Unit : '';
    dataElement.sourceFilled = data.Attr.SourceFilled;

    dataElement.displaySequenceOverrider = data.Attr.DisplaySequence;
    dataElement.isRequiredOverrider = data.Attr.IsRequired === 'true' ? true : false;

    dataElement.isRepeatable = data.Attr.IsRepeatable === 'true' ? true : false;
    dataElement.repeatGroup  = data.Attr.RepeatGroup;
    dataElement.repeatRefID  = data.Attr.RepeatCount;
    dataElement.isManuallyAdded = false;

    if (data.CodableConcept !== undefined) {
      dataElement.codableConcept = new CodableConcept();
      dataElement.codableConcept.name = data.CodableConcept.Attr.Name;
      if (data.CodableConcept.Coding !== undefined && data.CodableConcept.Coding.length > 0) {
        for (const coding of data.CodableConcept.Coding) {
          const _coding = new Coding();
          _coding.codingSystem.value = coding.System.Attr.Value;
          _coding.codingVersion.value = coding.Version.Attr.Value;
          _coding.codingCode.value = coding.Code.Attr.Value;
          _coding.codingDisplay.value = coding.Display.Attr.Value;
          _coding.codingUserSelected.value = coding.UserSelected !== undefined ? coding.UserSelected.Attr.Value : null;

          dataElement.codableConcept.coding.push(_coding);
        }
      }
    }
  }
}
