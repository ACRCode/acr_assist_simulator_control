import { Coding } from 'testruleengine/Library/Models/Class';
import { FHIROrganisation } from './fhir-organisation.model';

export class FHIRIdentifier {
    code: Array<Coding>;
    value: string;
    organisation: FHIROrganisation;

    constructor() {
        this.code = new Array<Coding>();
    }
}
