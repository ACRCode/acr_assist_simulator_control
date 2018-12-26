import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import * as _ from 'lodash';
import { Branch } from '../../models/branch.model';
import { DataElementValues } from '../../dataelementvalues';

export class PlainText implements IReportText {
    text: string;

    processText(template: Template, dataElementValues: Map<string, any>): any {
    }
}

PlainText.prototype.processText = function(template: Template, dataElementValues: Map<string, any>): string {
    return this.text;
};
