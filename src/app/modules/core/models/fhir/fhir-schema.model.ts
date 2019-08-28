import { FHIRModule } from "./fhir-module.model";
import { FHIRElement } from "./fhir-element.model";
import { FHIRReport } from "./fhir-report.model";

export class FHIRSchema {
    module: FHIRModule;
    elements: Array<FHIRElement>;
    result: Array<FHIRReport>;

    constructor() {
        this.module = new FHIRModule();
        this.elements = new Array<FHIRElement>();
        this.result = new Array<FHIRReport>();
    }
}
