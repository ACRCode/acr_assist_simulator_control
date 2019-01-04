import { RepeatedElementModel } from '../../../core/elements/models/repeated-element.model';

export class RepeatableElementRegisterService {
    constructor() { }
    static RepeatableDataElementsGroupName: Array<RepeatedElementModel> = [];

    public static ClearRepeatableDataElementsGroupName() {
        this.RepeatableDataElementsGroupName = [];
    }

    public static SetRepeatableDataElementsGroupName($repeatableDataElementsGroupName) {
        // this.RepeatableDataElementsGroupName = Object.assign([], $repeatableDataElementsGroupName);
        this.RepeatableDataElementsGroupName.push($repeatableDataElementsGroupName);
    }

    public static GetRepeatableDataElementsGroupNames(): Array<RepeatedElementModel> {
        return this.RepeatableDataElementsGroupName;
    }
}
