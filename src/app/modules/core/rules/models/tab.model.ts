import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import { DataElementValues } from '../../dataelementvalues';
import { Branch } from '../../models/branch.model';
import * as _ from 'lodash';

export class Tab implements IReportText {
    isTab: boolean;
    processText(template: Template, dataElementValues: Map<string, any>): any {}
    manupulateId(dynamicId: string): any {}
}

Tab.prototype.manupulateId = function(dynamicId): string {
    return this.isTab;
 };

Tab.prototype.processText = function(template: Template, dataElementValues: Map<string, any>): string {
    return '&nbsp;&nbsp;&nbsp;&nbsp;';
};

