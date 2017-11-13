import { DataElement } from '../shared/models/data-element.model';
import { StringUtilityService } from '../shared/services/string-utility.service';
export declare class DataElementComponent {
    private stringUtilityService;
    DataElements: DataElement[];
    FormValues: Object;
    ValidationBlocks: any[];
    formInitialized: boolean;
    defaultOption: string;
    console: Console;
    constructor(stringUtilityService: StringUtilityService);
    itemSelected(): void;
    evaluate(cond: any): any;
    updateMultichoice(DataElementID: any, choiceValue: any, event: any): void;
}
