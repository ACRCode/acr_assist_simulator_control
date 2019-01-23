export class NonRelevantPushPopService {
    private static NonRelevantIds =  Array<string>();
    public static SetNonRelevantDataElements(_nonRelevantIds: string[]) {
        this.NonRelevantIds = _nonRelevantIds;
    }

    public static GetNonRelevantDataelements(): string[] {
        const result = new this();
        return this.NonRelevantIds;
     }
}
