import { IReportText } from '../../endpoint/IReport-text.interface';
import { TemplateManagerService } from '../../../acr-assist-simulator/shared/services/template-manager.service';
import { SimulatorEngineService } from '../../services/simulator-engine.service';
import { Template } from '../../models/template.model';
import * as _ from 'lodash';
import { DataElementValues } from '../../dataelementvalues';
import { Branch } from '../../models/branch.model';

export class InsertPartial implements IReportText {
    partialId: String;

    processText(template: Template, dataElementValues: Map<string, any>): any {
    }

    findText(branch: Branch, template: Template, dataElementValues: Map<string, any>) {
        let $reportTextString = '';
        for (const reportText of branch.reportText) {
            const $reportText = reportText.GetPropertyType() as IReportText;
            $reportTextString += $reportText.processText(template, dataElementValues);
        }

        return $reportTextString;
    }
}

InsertPartial.prototype.processText = function (template: Template, dataElementValues: Map<string, any>): string {
    debugger;
    let $reportTextString = '';
    const _templatePartial = _.find(template.endpoint.templatePartials, (templatePartial) => templatePartial.id
        === this.partialId);

    if (_templatePartial !== undefined) {
        for (const _branch of _templatePartial.branches) {
            let conditionMet = false;
            if (_branch.compositeCondition !== undefined) {
                conditionMet = _branch.compositeCondition.evaluate(new DataElementValues(dataElementValues));
            }
            if (_branch.condition !== undefined) {
                conditionMet = _branch.condition.evaluate(new DataElementValues(dataElementValues));
            }

            if (conditionMet || (_branch.compositeCondition === undefined && _branch.condition === undefined)) {
                $reportTextString += this.findText(_branch, template, dataElementValues);
            }
        }
    }

    // console.log($reportTextString);
    return $reportTextString;
};
