import { DataElement } from '../shared/models/data-element.model';
import { StringUtilityService } from '../shared/services/string-utility.service';
export declare class ComputedElementComponent {
    private stringUtilityService;
    DataElement: DataElement;
    DataElements: Object;
    FormValues: Object;
    constructor(stringUtilityService: StringUtilityService);
    compute(exp: any): any;
    textify(textBlocks: any): string;
}
