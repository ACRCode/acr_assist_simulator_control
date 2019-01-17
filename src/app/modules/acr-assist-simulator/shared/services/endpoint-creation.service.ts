import { Endpoint } from '../../../core/endpoint/endpoint.model';
import { Injectable } from '@angular/core';
import { TemplatePartial } from '../../../core/endpoint/template-partial';
import { Branch } from '../../../core/models/branch.model';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { TextTemplateContent } from '../../../core/endpoint/text-template-content.model';
import { EndpointItem } from '../../../core/endpoint/endpoint-item.model';
import { EndPoint } from '../../../core/models/endpoint.model';
import { ReportSection } from '../../../core/endpoint/report-section.model';
import { ReportText } from '../../../core/endpoint/report-text.model';
import { EReportText } from '../../../core/endpoint/report-text-enum';
import { InsertPartial } from '../../../core/rules/models/insertpartial.model';
import { InsertValue } from '../../../core/rules/models/insertvalue.model';
import { PlainText } from '../../../core/rules/models/plain-text.model';
import { NewLine } from '../../../core/rules/models/new-line.model';
import { Tab } from '../../../core/rules/models/tab.model';
import { Space } from '../../../core/rules/models/space.model';
// import { EReportText } from '../../../core/endpoint/report-text-enum';


@Injectable()
export class EndpointCreationService {
    constructor(private conditionsCreationService: ConditionsCreationService,
        private computedValueCreationService: ComputedValueCreationService) {

    }

    public CreateEndPoints(endpointJson): Endpoint {
        const $endpoint = new Endpoint();
        $endpoint.templatePartials = this.GetTemplatePartialsFromJsonString(endpointJson);
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
                if (_endPoint.ReportSections !== undefined) {
                    if (!(_endPoint.ReportSections.ReportSection instanceof Array)) {
                        _endPoint.ReportSections.ReportSection = [_endPoint.ReportSections.ReportSection];
                    }

                    for (let index = 0; index < _endPoint.ReportSections.ReportSection.length; index++) {
                        $endpointItem.reportSections[index] = new ReportSection();
                        $endpointItem.reportSections[index].sectionId = _endPoint.ReportSections.ReportSection[index].Attr.SectionId;

                        if (_endPoint.ReportSections.ReportSection[index].Branch !== undefined) {
                            if (!(_endPoint.ReportSections.ReportSection[index].Branch instanceof Array)) {
                                _endPoint.ReportSections.ReportSection[index].Branch = [_endPoint.ReportSections.ReportSection[index].Branch];
                            }

                            for (let branchIndex = 0; branchIndex < _endPoint.ReportSections.ReportSection[index].Branch.length; branchIndex++) {
                                $endpointItem.reportSections[index].branch[branchIndex] = new Branch();
                                $endpointItem.reportSections[index].branch[branchIndex].condition = this.conditionsCreationService.returnCondition(_endPoint.ReportSections.ReportSection[index].Branch[branchIndex]);
                                $endpointItem.reportSections[index].branch[branchIndex].compositeCondition = this.conditionsCreationService.returnCompositeCondition(_endPoint.ReportSections.ReportSection[index].Branch[branchIndex]);

                                if (_endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText !== undefined) {
                                    if (!(_endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText instanceof Array)) {
                                        _endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText = [_endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText];
                                    }

                                    for (let textIndex = 0; textIndex < _endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText.length; textIndex++) {
                                        $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex] = new ReportText();
                                        switch (_endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText[textIndex].Attr.Type) {
                                            case EReportText.PlainText.toString():
                                                $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].plainText = new PlainText();
                                                $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].plainText.text =
                                                _endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText[textIndex]._;
                                                //  _endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText[textIndex].Attr.Value;
                                                break;

                                            case EReportText.InsertDataElementValue.toString():
                                                $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].insertValue = new InsertValue();
                                                $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].insertValue.dataElementId =
                                                _endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText[textIndex].Attr.Value;
                                                break;

                                            case EReportText.InsertPartialTemplate.toString():
                                                $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].insertPartial = new InsertPartial();
                                                $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].insertPartial.partialId =
                                                 _endPoint.ReportSections.ReportSection[index].Branch[branchIndex].ReportText[textIndex].Attr.Value;
                                                break;

                                            case EReportText.Newline.toString():
                                                $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].newLine = new NewLine();
                                                $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].newLine.isNewLine = true;
                                                break;

                                            case EReportText.Tab.toString():
                                            $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].tab = new Tab();
                                            $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].tab.isTab = true;
                                                break;

                                            case EReportText.Space.toString():
                                            $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].space = new Space();
                                            $endpointItem.reportSections[index].branch[branchIndex].reportText[textIndex].space.isSpace = true;
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                Endpoints.push($endpointItem);
            }
        }

        return Endpoints;
    }

    private GetTemplatePartialsFromJsonString(endpointJson): Array<TemplatePartial> {
        const TemplatePartials = new Array<TemplatePartial>();
        if (endpointJson.TemplatePartial !== undefined) {

            if (!(endpointJson.TemplatePartial instanceof Array)) {
                endpointJson.TemplatePartial = [endpointJson.TemplatePartial];
            }

            for (const _templatePartial of endpointJson.TemplatePartial) {
                const $templatePartial = new TemplatePartial();
                $templatePartial.id = _templatePartial.Attr.Id;

                if (_templatePartial.Branch !== undefined) {
                    if (!(_templatePartial.Branch instanceof Array)) {
                        _templatePartial.Branch = [_templatePartial.Branch];
                    }

                    for (let index = 0; index < _templatePartial.Branch.length; index++) {
                        $templatePartial.branches[index] = new Branch();
                        $templatePartial.branches[index].condition = this.conditionsCreationService.returnCondition(_templatePartial.Branch[index]);
                        $templatePartial.branches[index].compositeCondition = this.conditionsCreationService.returnCompositeCondition(_templatePartial.Branch[index]);

                        if (_templatePartial.Branch[index].ReportText !== undefined) {
                            if (!(_templatePartial.Branch[index].ReportText instanceof Array)) {
                                _templatePartial.Branch[index].ReportText = [_templatePartial.Branch[index].ReportText];
                            }

                            for (let textIndex = 0; textIndex < _templatePartial.Branch[index].ReportText.length; textIndex++) {
                                $templatePartial.branches[index].reportText[textIndex] = new ReportText();

                                switch (_templatePartial.Branch[index].ReportText[textIndex].Attr.Type) {
                                    case EReportText.PlainText.toString():
                                        $templatePartial.branches[index].reportText[textIndex].plainText = new PlainText();
                                        $templatePartial.branches[index].reportText[textIndex].plainText.text =
                                         _templatePartial.Branch[index].ReportText[textIndex]._;
                                        // _templatePartial.Branch[index].ReportText[textIndex].Attr.Value;
                                        break;

                                    case EReportText.InsertDataElementValue.toString():
                                        $templatePartial.branches[index].reportText[textIndex].insertValue = new InsertValue();
                                        $templatePartial.branches[index].reportText[textIndex].insertValue.dataElementId = _templatePartial.Branch[index].ReportText[textIndex].Attr.Value;
                                        break;

                                    case EReportText.InsertPartialTemplate.toString():
                                        $templatePartial.branches[index].reportText[textIndex].insertPartial = new InsertPartial();
                                        $templatePartial.branches[index].reportText[textIndex].insertPartial.partialId = _templatePartial.Branch[index].ReportText[textIndex].Attr.Value;
                                        break;

                                    case EReportText.Newline.toString():
                                        $templatePartial.branches[index].reportText[textIndex].newLine = new NewLine();
                                        $templatePartial.branches[index].reportText[textIndex].newLine.isNewLine = true;
                                        break;

                                    case EReportText.Tab.toString():
                                        $templatePartial.branches[index].reportText[textIndex].tab = new Tab();
                                        $templatePartial.branches[index].reportText[textIndex].tab.isTab = true;
                                        break;

                                    case EReportText.Tab.toString():
                                    $templatePartial.branches[index].reportText[textIndex].space = new Space();
                                    $templatePartial.branches[index].reportText[textIndex].space.isSpace = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                TemplatePartials.push($templatePartial);
            }

            return TemplatePartials;
        }
    }
}
