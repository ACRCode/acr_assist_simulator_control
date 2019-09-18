import { FHIRIdentifier } from "./fhir-identifier.model";

export class FHIRPractitioner {
    id: string;
    identifier: Array<FHIRIdentifier>;    
    gender: string;
    birthDate: string;

    constructor() {
        this.identifier = new Array<FHIRIdentifier>();
    }
}
