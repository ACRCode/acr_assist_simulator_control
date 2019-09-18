import { FHIRIdentifier } from "./fhir-identifier.model";

export class FHIRPatient {
    id: string;
    identifier: Array<FHIRIdentifier>;    
    gender: string;
    birthDate: string;

    constructor() {
        this.identifier = new Array<FHIRIdentifier>();
    }
}