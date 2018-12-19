import { BaseDataElement } from './base-data-element.model';
import { RepeatedElementSections } from './repeated-element-section.model';

export class RepeatedElementModel {
    ParentElement: any;
    ParentElementId: string;
    RepeatedElementSections: RepeatedElementSections[];
    constructor() {
       this.RepeatedElementSections = new Array<RepeatedElementSections>();
    }
}
