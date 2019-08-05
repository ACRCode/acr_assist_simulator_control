import { RepeatedElementSections } from './RepeatedElementSections';

export class RepeatedElementModel {
    ParentElement: any;
    ParentElementId: string;
    RepeatedElementSections: RepeatedElementSections[];
    constructor() {
       this.RepeatedElementSections = new Array<RepeatedElementSections>();
    }
}


