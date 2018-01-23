import { SectionIfValueNotCondition } from './section-if-value-not-condition';
import { SectionIfValueCondition } from './section-if-value-condition';

export class TemplatePartial {
    id: String;
    sectionIfNotValue: SectionIfValueNotCondition;
    sectionIfValues: SectionIfValueCondition[];
}
