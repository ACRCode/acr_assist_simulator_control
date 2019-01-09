import { InsertPartial } from '../rules/models/insertpartial.model';
import { InsertValue } from '../rules/models/insertvalue.model';
import { PlainText } from '../rules/models/plain-text.model';
import { NewLine } from '../rules/models/new-line.model';
import { Tab } from '../rules/models/tab.model';
import { IReportText } from './IReport-text.interface';
import { Space } from '../rules/models/space.model';

export class ReportText {
    insertPartial: InsertPartial;
    insertValue: InsertValue;
    plainText: PlainText;
    newLine: NewLine;
    tab: Tab;
    space: Space;

    GetPropertyType(): any {
    }
}

ReportText.prototype.GetPropertyType = function(): IReportText {
    if (this.insertPartial !== undefined) {
        return this.insertPartial;
    }

    if (this.insertValue !== undefined) {
        return this.insertValue;
    }

    if (this.plainText !== undefined) {
        return this.plainText;
    }

    if (this.newLine !== undefined) {
        return this.newLine;
    }

    if (this.tab !== undefined) {
        return this.tab;
    }

    if (this.space !== undefined) {
        return this.space;
    }
};
