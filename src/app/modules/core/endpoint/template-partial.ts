
import { Branch } from '../models/branch.model';
import { SectionIfValueNotCondition } from '../rules/section-if-value-not-condition';
import { SectionIfValueCondition } from '../rules/section-if-value-condition';

export class TemplatePartial {
    id: String;
    sectionIfNotValue: SectionIfValueNotCondition;
    sectionIfValues: SectionIfValueCondition[];
    branch: Branch;
}
