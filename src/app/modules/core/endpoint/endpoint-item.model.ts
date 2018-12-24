import { TemplatePartial } from './template-partial';
import { Diagnosis } from './diagnosis.model';
import { ReportText } from './report-text.model';

export class EndpointItem {
    id: string;
    label: string;
    diagnosis: Diagnosis;
    reportTexts: ReportText[] = [];
}
