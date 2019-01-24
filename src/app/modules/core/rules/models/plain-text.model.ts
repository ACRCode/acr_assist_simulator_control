import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import * as _ from 'lodash';
import { Branch } from '../../models/branch.model';
import { DataElementValues } from '../../dataelementvalues';
import { TabFormatingPushPopService } from '../../../acr-assist-simulator/shared/services/tab-formatting-push-pop.service';

export class PlainText implements IReportText {
    text: string;

    processText(template: Template, dataElementValues: Map<string, any>): any { }

    manupulateId(dynamicId: string): any { }
}

PlainText.prototype.manupulateId = function (dynamicId): string {
    return this.text;
};

PlainText.prototype.processText = function (template: Template, dataElementValues: Map<string, any>): string {
    return this.text;
};
