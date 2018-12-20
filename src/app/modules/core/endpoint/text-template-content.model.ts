import { InsertPartial } from '../rules/models/insertpartial.model';
import { InsertValue } from '../rules/models/insertvalue.model';

export class TextTemplateContent {
    insertPartial: InsertPartial;
    insertValue: InsertValue;
    text: string;
}
