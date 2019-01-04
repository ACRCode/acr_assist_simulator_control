import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import { DataElementValues } from '../../dataelementvalues';
import { Branch } from '../../models/branch.model';
import * as _ from 'lodash';

export class NewLine implements IReportText {
    isNewLine: boolean;
    processText(template: Template, dataElementValues: Map<string, any>): any {}

    manupulateId(dynamicId: string): any {}
}

NewLine.prototype.manupulateId = function(dynamicId): string {
    return this.isNewLine;
 };

NewLine.prototype.processText = function(template: Template, dataElementValues: Map<string, any>): string {
    return '<br>';
};
