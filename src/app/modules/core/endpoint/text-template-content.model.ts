import { InsertPartial } from 'testruleengine/Library/RuleEvaluator';
import { InsertValue }  from 'testruleengine/Library/RuleEvaluator';

export class TextTemplateContent {
    insertPartial: InsertPartial;
    insertValue: InsertValue;
    plainText: string;
    newLine: boolean;
}
