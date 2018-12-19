import { RepeatedElementModel } from '../../../core/elements/models/repeated-element.model';

export class RepeatableElementRegisterService {
    constructor() { }
    static RepeatableDataElementsGroupName: Array<RepeatedElementModel>;

    public static SetRepeatableDataElementsGroupName($repeatableDataElementsGroupName) {
        this.RepeatableDataElementsGroupName = Object.assign([], $repeatableDataElementsGroupName);
    }

    public static GetRepeatableDataElementsGroupNames(): Array<RepeatedElementModel> {
        return this.RepeatableDataElementsGroupName;
    }
}
