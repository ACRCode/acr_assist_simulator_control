import { Endpoint } from '../../../core/endpoint/endpoint.model';
import { Injectable } from '@angular/core';
import { TemplatePartial } from '../../../core/endpoint/template-partial';
import { Branch } from '../../../core/models/branch.model';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { TextTemplateContent } from '../../../core/endpoint/text-template-content.model';
import { EndpointItem } from '../../../core/endpoint/endpoint-item.model';
import { EndPoint } from '../../../core/models/endpoint.model';
import { ReportText } from '../../../core/endpoint/report-text.model';
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
        $endpoint.endpoints = this.GetEndpoints(endpointJson);
        return $endpoint;
    }

    private GetEndpoints(endpointJson): Array<EndpointItem> {
        const Endpoints = Array<EndpointItem>();
        if (endpointJson.EndPoint !== undefined) {
            for (const _endPoint of endpointJson.EndPoint) {
                const $endpointItem = new EndpointItem();
                $endpointItem.id = _endPoint.Attr.Id;
                $endpointItem.label = _endPoint.Label;
                if (_endPoint.ReportTexts !== undefined) {
                    for (let index = 0; index < _endPoint.ReportTexts.ReportText.length; index++) {
                        $endpointItem.reportTexts[index] = new ReportText();
                        $endpointItem.reportTexts[index].sectionId = _endPoint.ReportTexts.ReportText[index].Attr.SectionId;

                        if (_endPoint.ReportTexts.ReportText[index].Branch !== undefined) {
                           for (let branchIndex = 0; branchIndex < _endPoint.ReportTexts.ReportText[index].Branch.length; branchIndex++) {
                            $endpointItem.reportTexts[index].branch[branchIndex] = new Branch();
                            $endpointItem.reportTexts[index].branch[branchIndex].condition = this.conditionsCreationService.returnCondition(_endPoint.ReportTexts.ReportText[index].Branch[branchIndex]);
                            $endpointItem.reportTexts[index].branch[branchIndex].compositeCondition = this.conditionsCreationService.returnCompositeCondition(_endPoint.ReportTexts.ReportText[index].Branch[branchIndex]);                      
                            for (let textIndex = 0; textIndex < _endPoint.ReportTexts.ReportText[index].Branch[branchIndex].Texts.Text.length; textIndex++) {

                                $endpointItem.reportTexts[index].branch[branchIndex].texts[textIndex] = new TextTemplateContent();
                                $endpointItem.reportTexts[index].branch[branchIndex].texts[textIndex].insertPartial =
                                  _endPoint.ReportTexts.ReportText[index].Branch[branchIndex].Texts.Text[textIndex].InsertPartial;

                                  $endpointItem.reportTexts[index].branch[branchIndex].texts[textIndex].insertValue =
                                  _endPoint.ReportTexts.ReportText[index].Branch[branchIndex].Texts.Text[textIndex].InsertValue;

                                  $endpointItem.reportTexts[index].branch[branchIndex].texts[textIndex].plainText =
                                  _endPoint.ReportTexts.ReportText[index].Branch[branchIndex].Texts.Text[textIndex].PlainText;
                                }
                           }
                        }
                    }
                }

                console.log($endpointItem);
            }
        }

        return new Array<EndpointItem>();
    }

    private GetTemplatePartialsFromJsonString(endpointJson):  Array<TemplatePartial> {
        const TemplatePartials = new Array<TemplatePartial>();
        if (endpointJson.TemplatePartial !== undefined) {
            for (const _templatePartial of endpointJson.TemplatePartial) {
                const $templatePartial = new TemplatePartial();
                $templatePartial.id = _templatePartial.Attr.Id;

                if (_templatePartial.Branch !== undefined) {
                    // $templatePartial.branch = new Branch();
                    for (let index = 0; index < _templatePartial.Branch.length; index++) {
                        $templatePartial.branches[index] = new Branch();
                        $templatePartial.branches[index].condition = this.conditionsCreationService.returnCondition(_templatePartial.Branch[index]);
                        $templatePartial.branches[index].compositeCondition = this.conditionsCreationService.returnCompositeCondition(_templatePartial.Branch[index]);

                        if (_templatePartial.Branch[index].Texts !== undefined) {                       
                            for (let textIndex = 0; textIndex < _templatePartial.Branch[index].Texts.Text.length; textIndex++) {
                                $templatePartial.branches[index].texts[textIndex] = new TextTemplateContent();
                                $templatePartial.branches[index].texts[textIndex].plainText =   _templatePartial.Branch[index].Texts.Text[textIndex].PlainText;
                                $templatePartial.branches[index].texts[textIndex].insertPartial =   _templatePartial.Branch[index].Texts.Text[textIndex].InsertPartial;
                                $templatePartial.branches[index].texts[textIndex].insertValue =   _templatePartial.Branch[index].Texts.Text[textIndex].InsertValue;
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
