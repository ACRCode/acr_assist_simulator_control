import { Endpoint } from '../../../core/endpoint/endpoint.model';
import { Injectable } from '@angular/core';
import { TemplatePartial } from '../../../core/endpoint/template-partial';
import { Branch } from '../../../core/models/branch.model';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
// import { EndPoint } from '../../../core/models/endpoint.model';

@Injectable()
export class EndpointCreationService {
    constructor(private conditionsCreationService: ConditionsCreationService,
        private computedValueCreationService: ComputedValueCreationService) {

    }

    public CreateEndPoints(endpointJson): Array<Endpoint> {
        console.log(endpointJson);

        const Endpoints = new Array<Endpoint>();
        const TemplatePartials = new Array<TemplatePartial>();
        if (endpointJson.TemplatePartial !== undefined) {
            for (const _templatePartial of endpointJson.TemplatePartial) {
                const $templatePartial = new TemplatePartial();
                $templatePartial.id = _templatePartial.Attr.Id;

                if (_templatePartial.Branch !== undefined) {
                    $templatePartial.branch = new Branch();
                    // $templatePartial.branch.branches = new Array<Branch>();
                    for (let index = 0; index < _templatePartial.Branch.Branch.length; index++) {
                        $templatePartial.branch.branches[index] = new Branch();
                        $templatePartial.branch.branches[index].condition = this.conditionsCreationService.returnCondition(_templatePartial.Branch.Branch[index]);
                        $templatePartial.branch.branches[index].compositeCondition = this.conditionsCreationService.returnCompositeCondition(_templatePartial.Branch.Branch[index]);
                         console.log($templatePartial.branch.branches[index].compositeCondition);
                    }
                }

                TemplatePartials.push($templatePartial);
            }

            console.log('test');
            console.log(TemplatePartials);
        }

        return new Array<Endpoint>();
    }
}
