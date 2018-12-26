import { Template } from '../../../core/models/template.model';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Branch } from '../../../core/models/branch.model';
import { DataElementValues } from '../../../core/dataelementvalues';
import { RuleEvaluationResult } from '../../../core/endpoint/rule-evaluation-result.model';
import { EndpointItem } from '../../../core/endpoint/endpoint-item.model';
import { IReportText } from '../../../core/endpoint/IReport-text.interface';

@Injectable()
export class RuleEngineService {
    ruleEvaluationResults = Array<RuleEvaluationResult>();
    $template: Template;
    $dataElementValues:  Map<string, any>;
    EvaluateRules(template: Template, endpoints: string[], dataElementValues: Map<string, any>) {
        this.ruleEvaluationResults = [];
        this.$template = template;
        this.$dataElementValues = dataElementValues;
        for (const _endpoint of endpoints) {
            const $endpoint = _.find(template.endpoint.endpoints, (endpoint) => endpoint.id === _endpoint);
           this.processEndpointAndGenerateReportText($endpoint);
        }

        console.log(this.ruleEvaluationResults);
        return this.ruleEvaluationResults;
    }

    processEndpointAndGenerateReportText($endpoint: EndpointItem): RuleEvaluationResult[] {
       const ruleEvaluationResults = new RuleEvaluationResult();
       let $reportTextString = '';
        for (const _reportSection of $endpoint.reportSections) {
            let conditionMet = false;
            for (const _branch of _reportSection.branch) {
                if (_branch.compositeCondition !== undefined) {
                    conditionMet = _branch.compositeCondition.evaluate(new DataElementValues(this.$dataElementValues));
                }
                if (_branch.condition !== undefined) {
                    conditionMet = _branch.condition.evaluate(new DataElementValues(this.$dataElementValues));
                }

                if (conditionMet || (_branch.compositeCondition === undefined && _branch.condition === undefined)) {
                    $reportTextString += this.ProcessBranch(_branch);
                }
            }

            ruleEvaluationResults.reportText = $reportTextString;
            ruleEvaluationResults.sectionId = _reportSection.sectionId;
            this.ruleEvaluationResults.push(ruleEvaluationResults);
        }

        return this.ruleEvaluationResults;
    }

    ProcessBranch(branch: Branch): string {
        let $reportTextString = '';
        for (const reportText of branch.reportText) {
            const $reportText = reportText.GetPropertyType() as IReportText;
            $reportTextString +=  $reportText.processText(this.$template, this.$dataElementValues);
        }

        return $reportTextString;
    }
}
