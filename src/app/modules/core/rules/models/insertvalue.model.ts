import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import { DataElementValues } from '../../dataelementvalues';
import * as _ from 'lodash';

export class InsertValue implements IReportText {
  dataElementId: String;
  significantDigits: number;

  processText(template: Template, dataElementValues: Map<string, any>): any {
  }
}

InsertValue.prototype.processText = function (template: Template, dataElementValues: Map<string, any>): string { 
  if (dataElementValues[this.dataElementId] === undefined) {
    return '';
  }
  
  return dataElementValues[this.dataElementId];
};

