import { Coding } from 'testruleengine/Library/Models/Class';
import { FHIRObservation } from './fhir-observation.model';
import { FHIRPatient } from './fhir-patient.model';
import { FHIRProcedure } from './fhir-procedure.model';
import { FHIROrganisation } from './fhir-organisation.model';

export class FHIRReport {
    name: string;
    code: Array<Coding>;
    patient: FHIRPatient;
    procedure: FHIRProcedure;
    observations: Array<FHIRObservation>;
    category: string;
    result: string;
    performer: FHIROrganisation;

    constructor() {
        this.code = new Array<Coding>();
        this.observations = new Array<FHIRObservation>();
    }
}
