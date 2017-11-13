import { EndPoint } from './endpoint.model';
export declare class ExpressionBlock {
    Condition: string;
    TextCondition: string;
    NestedBlocks: ExpressionBlock[];
    Result: EndPoint;
    ElseBlocks: ExpressionBlock[];
    NotRelavantDataElements: any[];
    ValidationCondition: string;
    ArithmeticExpression: string;
    TextExpression: Object[];
    Level: number;
    Index: number;
    ParentID: string;
    constructor();
}
