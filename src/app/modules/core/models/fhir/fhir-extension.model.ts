export class FHIRExtension {
    url: string;
    valueString: string;

    constructor(url: string, valueString: string) {
        this.url = url;
        this.valueString = valueString;
    }
}
