import { Coding } from 'testruleengine/Library/Models/Class';
import { FHIRObservation } from './fhir-observation.model';

export class FHIRReport {
    name: string;
    code: Array<Coding>;
    observations: Array<FHIRObservation>;
    result: string;

    constructor() {
        this.observations = new Array<FHIRObservation>();
    }
}
