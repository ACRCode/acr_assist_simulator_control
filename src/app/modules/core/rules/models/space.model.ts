import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import { DataElementValues } from '../../dataelementvalues';
import { Branch } from '../../models/branch.model';
import * as _ from 'lodash';

export class Space implements IReportText {
    isSpace: boolean;
    processText(template: Template, dataElementValues: Map<string, any>): any {}

    manupulateId(dynamicId: string): any {}
}

Space.prototype.manupulateId = function(dynamicId): string {
    return this.isSpace;
 };

 Space.prototype.processText = function(template: Template, dataElementValues: Map<string, any>): string {
    return ' ';
};
