import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
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
  const $dataElementValues = dataElementValues.get(this.dataElementId);
  const choiceDataElementResults = this.IsDataElementChoiceDataElement(template);
  let possibleValues = [];

  if ($dataElementValues === undefined) {
    if (choiceDataElementResults != null) {
      const choiceElem = choiceDataElementResults[0] as ChoiceDataElement;
      choiceElem.choiceInfo.filter(function (choice) {
        return possibleValues.push(choice.label);
      });
    }

    return '[ ' + possibleValues.join(' / ') + ' ]';
  }

  if (choiceDataElementResults != null) {
    const choiceDataElementResult = choiceDataElementResults[0] as ChoiceDataElement;
    if ($dataElementValues !== undefined && $dataElementValues instanceof Array) {
      if ($dataElementValues.length > 0) {
        possibleValues = $dataElementValues;
      } else {
        choiceDataElementResult.choiceInfo.filter(function (choice) {
          return possibleValues.push(choice.label);
        });
      }

      return '[ ' + possibleValues.join(' / ') + ' ]';
    } else {
      const result = choiceDataElementResult.choiceInfo.filter(function (choice) {
        return choice.value === $dataElementValues;
      });

      if (result.length > 0) {
        return '[ ' + result[0].label + ' ]';
      } else if ($dataElementValues === 'freetext' || $dataElementValues === '') {
        choiceDataElementResult.choiceInfo.filter(function (val) {
          return possibleValues.push(val.label);
        });
        return '[ ' + possibleValues.join(' / ') + ' ]';
      }
    }
  }

  return '[ ' + $dataElementValues + ' ]';
};
