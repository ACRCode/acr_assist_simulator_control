import { Endpoint } from '../../../core/endpoint/endpoint.model';
import { Injectable } from '@angular/core';
import { TemplatePartial } from '../../../core/endpoint/template-partial';
import { Branch } from '../../../core/models/branch.model';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { TextTemplateContent } from '../../../core/endpoint/text-template-content.model';
import { EndpointItem } from '../../../core/endpoint/endpoint-item.model';
import { EndPoint } from '../../../core/models/endpoint.model';
// import { EndPoint } from '../../../core/models/endpoint.model';

@Injectable()
export class EndpointCreationService {
    constructor(private conditionsCreationService: ConditionsCreationService,
        private computedValueCreationService: ComputedValueCreationService) {

    }

    public CreateEndPoints(endpointJson): Endpoint {
        console.log(endpointJson);
        const $endpoint = new Endpoint();
        $endpoint.templatePartials =  this.GetTemplatePartialsFromJsonString(endpointJson);
        // $endpoint.endpoints = this.GetEndpoints(endpointJson);
        return $endpoint;
    }

    // private GetEndpoints(endpointJson): Array<EndpointItem> {
    //     const Endpoints = Array<EndpointItem>();
    //     if (endpointJson.EndPoint !== undefined) {
    //         for (const _endPoint of endpointJson.EndPoint) {
    //             const $endpointItem = new EndpointItem();
    //             $endpointItem.id = _endPoint.Attr.Id;
    //             $endpointItem.label = _endPoint.Label;
    //             if (_endPoint.ReportTexts !== undefined) {
    //                    $endpointItem. 
    //             }
    //         }
    //     }
        
    //     return new Array<EndpointItem>();
    // }

    private GetTemplatePartialsFromJsonString(endpointJson):  Array<TemplatePartial> {
        const TemplatePartials = new Array<TemplatePartial>();
        if (endpointJson.TemplatePartial !== undefined) {
            for (const _templatePartial of endpointJson.TemplatePartial) {
                const $templatePartial = new TemplatePartial();
                $templatePartial.id = _templatePartial.Attr.Id;

                if (_templatePartial.Branch !== undefined) {
                    $templatePartial.branch = new Branch();
                    for (let index = 0; index < _templatePartial.Branch.Branch.length; index++) {
                        $templatePartial.branch.branches[index] = new Branch();
                        $templatePartial.branch.branches[index].condition = this.conditionsCreationService.returnCondition(_templatePartial.Branch.Branch[index]);
                        $templatePartial.branch.branches[index].compositeCondition = this.conditionsCreationService.returnCompositeCondition(_templatePartial.Branch.Branch[index]);

                        if (_templatePartial.Branch.Branch[index].Texts !== undefined) {
                            for (let textIndex = 0; textIndex < _templatePartial.Branch.Branch[index].Texts.Text.length; textIndex++) {
                                $templatePartial.branch.branches[index].texts[textIndex] = new TextTemplateContent();
                                $templatePartial.branch.branches[index].texts[textIndex].plainText =   _templatePartial.Branch.Branch[index].Texts.Text[textIndex].PlainText;
                                $templatePartial.branch.branches[index].texts[textIndex].insertPartial =   _templatePartial.Branch.Branch[index].Texts.Text[textIndex].InsertPartial;
                                $templatePartial.branch.branches[index].texts[textIndex].insertValue =   _templatePartial.Branch.Branch[index].Texts.Text[textIndex].InsertValue;
                            }
                        }
                    }
                }

                console.log($templatePartial);
                TemplatePartials.push($templatePartial);
            }

            return TemplatePartials;
        }
    }
}
