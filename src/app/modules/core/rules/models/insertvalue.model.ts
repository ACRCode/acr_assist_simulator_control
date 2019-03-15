import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import { DataElementValues } from '../../dataelementvalues';
import * as _ from 'lodash';
import { ChoiceDataElement } from '../../elements/models/choice-data-element-model';

export class InsertValue implements IReportText {
  dataElementId: String;
  significantDigits: number;

  processText(template: Template, dataElementValues: Map<string, any>): any { }

  manupulateId(dynamicId: string): any { }

  IsDataElementChoiceDataElement(template: Template): ChoiceDataElement[] {
    const $dataElementId = this.dataElementId;
    const result = template.dataElements.filter(function (obj) {
      return obj.id === $dataElementId && (obj.dataElementType === 'ChoiceDataElement' ||
        obj.dataElementType === 'MultiChoiceDataElement');
    });

    return result !== undefined && result.length > 0 ? result as ChoiceDataElement[] : null;
  }
}

InsertValue.prototype.manupulateId = function (dynamicId): string {
  return this.dataElementId + '_' + dynamicId;
};

InsertValue.prototype.processText = function (template: Template, dataElementValues: Map<string, any>): string {
  if (dataElementValues[this.dataElementId] === undefined) {
    return '';
  }

  const choiceDataElementResults = this.IsDataElementChoiceDataElement(template);
  if (choiceDataElementResults != null) {
    const choiceDataElementResult = choiceDataElementResults[0] as ChoiceDataElement;
    if (dataElementValues[this.dataElementId] !== undefined
      && dataElementValues[this.dataElementId] instanceof Array) {
      const values = [];
      for (const $dataElementValues of dataElementValues[this.dataElementId]) {
        var items = choiceDataElementResult.choiceInfo.filter(function (choice) {
          return choice.value === $dataElementValues;
        });
        if (items !== undefined && items.length > 0) {
          values.push(items[0].label);
        } else {
          values.push($dataElementValues);
        }
      }

      return values !== undefined ? values.join(', ') : '';
    } else {
      const values = [];
      const $dataElementValues = dataElementValues[this.dataElementId];
      const result = choiceDataElementResult.choiceInfo.filter(function (choice) {
        return choice.value === $dataElementValues;
      });

      return result !== undefined && result.length > 0 ? result[0].label :
        ($dataElementValues !== undefined && ($dataElementValues === 'freetext' || $dataElementValues === '')
          ? '' : $dataElementValues);
    }
  }

  if (dataElementValues[this.dataElementId] !== undefined
    && dataElementValues[this.dataElementId] instanceof Array) {
    return dataElementValues[this.dataElementId].join(', ');
  }

  return dataElementValues[this.dataElementId];
};



