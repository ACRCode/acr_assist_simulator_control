import { Coding } from 'testruleengine/Library/Models/Class';
import { FHIRValue } from './fhir-value.model';

export class FHIRObservation {
    id: string;
    code: Array<Coding>;
    values: Array<FHIRValue>;
    references: Array<string>;

    constructor() {
        this.code = new Array<Coding>();
        this.values = new Array<FHIRValue>();
        this.references = new Array<string>();
    }
}
