import { Coding } from 'testruleengine/Library/Models/Class';
import { FHIRExtensions } from "./fhir-extensions.model";

export class FHIRProcedure {
    id: string;
    extensions: Array<FHIRExtensions>;
    status: string;
    intent: string;
    code: Array<Coding>;
    text: string;
    occurrenceDateTime: string;

    constructor() {
        this.code = new Array<Coding>();
        this.extensions = new Array<FHIRExtensions>();
    }
}
