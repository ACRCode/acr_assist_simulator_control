import { FHIRExtension } from "./fhir-extension.model";

export class FHIRExtensions {
    extension: Array<FHIRExtension>;
    url: string;

    constructor() {
        this.extension = new Array<FHIRExtension>();
    }
}