import { ExpressionBlock } from '../shared/models/expression-block.model';
import { DataElement } from '../shared/models/data-element.model';
import { GlobalsService } from '../shared/services/globals.service';
export declare class ValueBlockComponent {
    private globalsService;
    ValueBlock: ExpressionBlock;
    DataElement: DataElement;
    DataElements: Object;
    FormValues: Object;
    constructor(globalsService: GlobalsService);
    evaluate(exp: any): any;
    validate(exp: any): any;
    compute(exp: any): any;
    textify(textBlocks: any): string;
}
