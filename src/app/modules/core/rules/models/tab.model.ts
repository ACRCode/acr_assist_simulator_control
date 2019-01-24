import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import { DataElementValues } from '../../dataelementvalues';
import { Branch } from '../../models/branch.model';
import * as _ from 'lodash';
import { TabFormatingPushPopService } from '../../../acr-assist-simulator/shared/services/tab-formatting-push-pop.service';

export class Tab implements IReportText {
    isTab: boolean;
    processText(template: Template, dataElementValues: Map<string, any>): any { }
    manupulateId(dynamicId: string): any { }
}

Tab.prototype.manupulateId = function (dynamicId): string {
    return this.isTab;
};

Tab.prototype.processText = function (template: Template, dataElementValues: Map<string, any>): string {
    TabFormatingPushPopService.SetIsTabbed(true);
    const result = '<div class="spantest" style="margin-left:50px">'; // + '</span>';
    return result;

    // return '&nbsp;&nbsp;&nbsp;&nbsp;';
    // return '';
};

