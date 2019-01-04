import { Template } from '../models/template.model';

export interface IReportText {
    processText(template: Template, dataElementValues: Map<string, any>): string;

    manupulateId(dynamicId): string;
}
