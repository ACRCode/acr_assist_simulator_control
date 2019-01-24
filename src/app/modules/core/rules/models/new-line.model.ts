import { IReportText } from '../../endpoint/IReport-text.interface';
import { Template } from '../../models/template.model';
import { DataElementValues } from '../../dataelementvalues';
import { Branch } from '../../models/branch.model';
import * as _ from 'lodash';
import { TabFormatingPushPopService } from '../../../acr-assist-simulator/shared/services/tab-formatting-push-pop.service';

export class NewLine implements IReportText {
    isNewLine: boolean;
    processText(template: Template, dataElementValues: Map<string, any>): any { }

    manupulateId(dynamicId: string): any { }
}

NewLine.prototype.manupulateId = function (dynamicId): string {
    return this.isNewLine;
};

NewLine.prototype.processText = function (template: Template, dataElementValues: Map<string, any>): string {
    if (TabFormatingPushPopService.GetIsTabbed()) {
        TabFormatingPushPopService.SetIsTabbed(false);
        return '</div>';
    }

    return '<br>';
};
