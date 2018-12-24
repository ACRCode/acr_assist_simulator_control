import { Template } from "../../../core/models/template.model";
import { Injectable } from "@angular/core";

@Injectable()
export class RuleEngineService {
    constructor() {    }

    EvaluateRules(template: Template, endpoints: string[]) {
        console.log(template);
        return null;
    }
}
