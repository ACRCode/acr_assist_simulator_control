import { Coding } from 'testruleengine/Library/Models/Class';
import { FHIRValue } from './fhir-value.model';
import { FHIRDevice } from './fhir-device.model';
import { FHIRPractitioner } from './fhir-practitioner.model';

export class FHIRObservation {
    id: string;
    device: FHIRDevice;
    practitioner: FHIRPractitioner;
    code: Array<Coding>;
    values: Array<FHIRValue>;
    references: string;

    constructor() {
        this.code = new Array<Coding>();
        this.values = new Array<FHIRValue>();
    }
}
