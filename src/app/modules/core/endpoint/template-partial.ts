import { SectionIfValueNotCondition } from './section-if-value-not-condition';
import { SectionIfValueCondition } from './section-if-value-condition';
import { Branch } from '../models/branch.model';

export class TemplatePartial {
    id: String;
    sectionIfNotValue: SectionIfValueNotCondition;
    sectionIfValues: SectionIfValueCondition[];
    branch: Branch;
}
