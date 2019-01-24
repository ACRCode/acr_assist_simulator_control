export class TabFormatingPushPopService {
    private static IsTabbed = false;
    public static SetIsTabbed (_isTabbed: boolean) {
        this.IsTabbed = _isTabbed;
    }

    public static GetIsTabbed(): boolean {
        const result = new this();
        return this.IsTabbed;
     }
}
