import { FHIRReport } from './fhir-report.model';

export class FHIRSchema {
    report: FHIRReport;

    constructor() {
        this.report = new FHIRReport();
    }
}
