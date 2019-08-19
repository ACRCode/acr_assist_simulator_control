import { EndPoint } from 'testruleengine/Library/Models/Class';

export class ExpressionBlock {
    public Condition = '';

    public TextCondition = '';

    public NestedBlocks: ExpressionBlock[] = [];

    public Result: EndPoint;

    public ElseBlocks: ExpressionBlock[] = [];

    public NotRelavantDataElements = [];

    public ValidationCondition = '';

    public ArithmeticExpression = '';

    public TextExpression: object[];

    public Level: number;

    public Index: number;

    public ParentID = '';

    constructor() {
        this.Condition = '';
        this.TextCondition = '';
        this.ValidationCondition = '';
        this.NestedBlocks = [];
        this.ParentID = '';

        this.ElseBlocks = [];
        this.NotRelavantDataElements = [];
    }


}
