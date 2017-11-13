import { EventEmitter } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { DataElement } from '../shared/models/data-element.model';
export declare class ExpresssionBlockComponent {
    private globalsService;
    FormValues: Object;
    ExpBlock: ExpressionBlock;
    DataElements: DataElement[];
    onExpressionChanged: EventEmitter<DataElement[]>;
    constructor(globalsService: GlobalsService);
    validate(cond: any): any;
    evaluate(cond: any, notRelevantDataElments: any): any;
}
