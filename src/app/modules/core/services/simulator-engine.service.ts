import { Injectable } from '@angular/core';
import { Template } from '../models/template.model';
import { SimulatorState } from '../models/simulator-state.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DecisionPoint } from '../models/decisionpoint.model';
import { DataElementValues } from '../dataelementvalues';
import { ComputedDataElement } from '../elements/models/computed-data-element-model';
import { ArithmeticExpression } from '../models/arithmetic-expression.model';
import { isArray } from 'util';
import { ChoiceDataElement } from '../elements/models/choice-data-element-model';
import { NumericDataElement } from '../elements/models/numeric-data-element.model';
import { IntegerDataElement } from '../elements/models/integer-data-element.model';
import { DurationDataElement } from '../elements/models/duration-data-element.model';
import { MultiChoiceDataElement } from '../elements/models/multi-choice-data-element';
import { RuleEngineService } from '../../acr-assist-simulator/shared/services/rule-engine-service';
import { RepeatableElementRegisterService } from '../../acr-assist-simulator/shared/services/repeatable-element-register.service';
const expressionParser = require('expr-eval').Parser;
import * as _ from 'lodash';
import { BaseDataElement } from '../elements/models/base-data-element.model';
import { Branch } from '../models/branch.model';
import { EndPointRef } from '../models/endpointref.model';

@Injectable()
export class SimulatorEngineService {

  private template: Template;
  private dataElementValues: Map<string, any>;
  private dataElementTexts: Map<string, any>;
  private endOfRoadReached = false;
  private lastConditionMetBranchLevel = 1;
  private nonRelevantDataElementIds = new Array<string>();

  simulatorStateChanged = new BehaviorSubject<SimulatorState>(new SimulatorState());

  constructor(private ruleEngineService: RuleEngineService, private repeatableElementRegisterService: RepeatableElementRegisterService) {
    this.dataElementValues = new Map<string, any>();
    this.dataElementTexts = new Map<string, any>();
    this.nonRelevantDataElementIds = new Array<string>();
  }

  getTemplate(): Template {
    return this.template;
  }

  setTemplate() {

  }

  getAllDataElementValues(): Map<string, any> {
    return this.dataElementValues;
  }

  getAllDataElementTexts(): Map<string, any> {
    return this.dataElementTexts;
  }

  getDataElementValue(dataElementId: string): any {
    return this.dataElementValues[dataElementId];
  }

  getDataElementText(dataElementId: string): any {
    return this.dataElementTexts[dataElementId];
  }

  addOrUpdateDataElement(dataElementId: string, value: any, text: any) {
    this.dataElementValues[dataElementId] = value;
    this.dataElementTexts[dataElementId] = text;
    this.evaluateDecisionPoints();
  }

  evaluateDecisionPoint(decisionPoint: DecisionPoint, branchingLevel) {
    // debugger;
    let endpoints = Array<string>();
    let currentBranchCount = 0;
    const totalBranchesInDecisionPoint = decisionPoint.branches.length;
    for (const branch of decisionPoint.branches) {
      currentBranchCount++;
      let conditionMet = false;
      if (this.endOfRoadReached) {
        break;
      }

      if (branch.compositeCondition !== undefined) {
        conditionMet = branch.compositeCondition.evaluate(new DataElementValues(this.dataElementValues));
      } else if (branch.condition !== undefined) {
        conditionMet = branch.condition.evaluate(new DataElementValues(this.dataElementValues));
      }

      if (conditionMet && !branch.endPointRef.isRepeatable) {
        debugger;
        this.lastConditionMetBranchLevel = branchingLevel;
        if (branch.decisionPoints !== undefined) {
          for (const branchDecisionPoint of branch.decisionPoints) {
            const newBranchingLevel = branchingLevel + 1;
            this.evaluateDecisionPoint(branchDecisionPoint, newBranchingLevel);
          }
        } else if (branch.endPointRef !== undefined) {
          endpoints.push(branch.endPointRef.endPointId);
        }
      }
      // else {
      //   if (currentBranchCount >= totalBranchesInDecisionPoint) {
      //     // this.endOfRoadReached = true;
      //     // const simulatorState = new SimulatorState();
      //     // this.simulatorStateChanged.next(simulatorState);
      //     // return;
      //   } else {
      //     continue;
      //   }
      // }
    }

    const $simulatorState = new SimulatorState();
    if (endpoints !== undefined && endpoints.length > 0) {
      $simulatorState.endPointIds = endpoints;
      $simulatorState.ruleEvaluationResults = this.ruleEngineService.EvaluateRules(this.template, endpoints, this.dataElementValues);
      this.simulatorStateChanged.next($simulatorState);
    } else {
      this.simulatorStateChanged.next($simulatorState);
    }
  }

  private resetValuesOfNonRelevantDataElements(nonRelevantDataElementIds: string[]) {
    if (nonRelevantDataElementIds !== undefined) {
      for (const nonRelevantDataElementId of nonRelevantDataElementIds) {
        let defaultValue: any;
        for (const dataElement of this.template.dataElements) {
          if (dataElement.id === nonRelevantDataElementId) {
            defaultValue = dataElement.defaultValue;
            break;
          }
        }

        this.dataElementValues[nonRelevantDataElementId] = defaultValue;
      }
    }
  }

  evaluateComputedElementDecisionPoint(elementId: string, decisionPoint: DecisionPoint, branchingLevel) {
    let currentBranchCount = 0;
    const totalBranchesInDecisionPoint = decisionPoint.branches.length;
    for (const branch of decisionPoint.branches) {

      currentBranchCount++;
      let conditionMet = false;
      if (this.endOfRoadReached) {
        break;
      }
      if (branch.compositeCondition !== undefined) {
        conditionMet = branch.compositeCondition.evaluate(new DataElementValues(this.dataElementValues));
      } else if (branch.condition !== undefined) {
        conditionMet = branch.condition.evaluate(new DataElementValues(this.dataElementValues));
      }

      if (conditionMet) {
        this.lastConditionMetBranchLevel = branchingLevel;
        if (branch.decisionPoints !== undefined) {
          for (const branchDecisionPoint of branch.decisionPoints) {
            const newBranchingLevel = branchingLevel + 1;
            this.evaluateComputedElementDecisionPoint(elementId, branchDecisionPoint, newBranchingLevel);
          }
        } else if (branch.computedValue !== undefined) {

          this.dataElementValues[elementId] = branch.computedValue.expressionText;
          this.endOfRoadReached = true;
          if (branch.computedValue instanceof ArithmeticExpression) {
            this.dataElementValues[elementId] = this.evaluateArithmeticExpression(branch.computedValue.expressionText);
            this.endOfRoadReached = true;
          } else {
            this.dataElementValues[elementId] = branch.computedValue.expressionText;
            this.endOfRoadReached = true;
          }

          break;
        }
      } else {
        if (currentBranchCount >= totalBranchesInDecisionPoint) {
          this.endOfRoadReached = true;
          this.dataElementValues[elementId] = undefined;
          return;
        } else {
          continue;
        }
      }
    }
  }

  private evaluateArithmeticExpression(computedValue: string): any {
    let startIndex = 0;
    let endIndex = 0;
    while (startIndex !== -1 && endIndex !== -1) {
      startIndex = computedValue.indexOf('{');
      endIndex = computedValue.indexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        const dataElementId = computedValue.substring(startIndex + 1, endIndex);
        const replacingValue = computedValue.substring(startIndex, endIndex + 1);
        let dataElementValue = this.dataElementValues[dataElementId];
        if (isArray(dataElementValue)) {
          let sum = 0;
          dataElementValue.forEach(val => {
            sum += +val;
          });
          dataElementValue = sum;
        }

        computedValue = computedValue.replace(replacingValue, dataElementValue);
      }
    }

    return expressionParser.evaluate(computedValue).toString();
  }


  private evaluateComputedExpressions() {
    this.endOfRoadReached = false;
    let expressionValue: any;
    for (const element of this.template.dataElements) {
      if (element.dataElementType === 'ComputedDataElement') {
        expressionValue = undefined;
        const computedElement: ComputedDataElement = element as ComputedDataElement;
        for (const decisionPoint of computedElement.decisionPoints) {
          this.evaluateComputedElementDecisionPoint(element.id, decisionPoint, 1);
          if (this.dataElementValues[element.id] === undefined && decisionPoint.defaultBranch &&
            decisionPoint.defaultBranch.computedValue) {
            this.dataElementValues[element.id] = decisionPoint.defaultBranch.computedValue.expressionText;
          }
          this.endOfRoadReached = false;
        }
      }
    }
  }

  private evaluateConditionalProperty(dataelement, nonRelevantDataElementIds: string[] = []): Array<string> {
    if (dataelement.conditionalProperties !== undefined) {
      let conditionMet = false;
      let isCompositeCondition = false;
      for (const conditionalProperty of dataelement.conditionalProperties) {
        if (conditionalProperty.condition !== undefined) {
          conditionMet = conditionalProperty.condition.evaluate(new DataElementValues(this.dataElementValues));
          isCompositeCondition = false;
        } else if (conditionalProperty.compositeCondition !== undefined) {
          conditionMet = conditionalProperty.compositeCondition.evaluate(new DataElementValues(this.dataElementValues));
          isCompositeCondition = true;
        }

        if (conditionMet) {
          if (nonRelevantDataElementIds === undefined) {
            this.nonRelevantDataElementIds = new Array<string>();
          }

          if (conditionalProperty.isRelevant === 'false') {
            this.nonRelevantDataElementIds.push(dataelement.id);
          } else {
            dataelement.displaySequence = conditionalProperty.DisplaySequence;
            dataelement.isRequired = conditionalProperty.isRequired !== undefined ?
              (conditionalProperty.isRequired.toLowerCase() === 'true' ? true : false)
              : true;

            if (conditionalProperty.Minimum !== undefined && conditionalProperty.Minimum != null) {
              dataelement.minimum = +conditionalProperty.Minimum;
            }
            if (conditionalProperty.Maximum !== undefined && conditionalProperty.Maximum != null) {
              dataelement.maximum = +conditionalProperty.Maximum;
            }

            if (dataelement.dataElementType === 'ChoiceDataElement') {
              (dataelement as ChoiceDataElement).ChoiceNotRelevant = conditionalProperty.ChoiceNotRelevant;
            }

            if (dataelement.dataElementType === 'MultiChoiceDataElement') {
              (dataelement as MultiChoiceDataElement).ChoiceNotRelevant = conditionalProperty.ChoiceNotRelevant;
            }

            if (dataelement.dataElementType === 'DurationDataElement') {
              (dataelement as DurationDataElement).MinimumDay = +conditionalProperty.MinimumDay;
              (dataelement as DurationDataElement).MaximumDay = +conditionalProperty.MaximumDay;
              (dataelement as DurationDataElement).MinimumHours = +conditionalProperty.MinimumHours;
              (dataelement as DurationDataElement).MaximumHours = +conditionalProperty.MaximumHours;
              (dataelement as DurationDataElement).MinimumMinutes = +conditionalProperty.MinimumMinutes;
              (dataelement as DurationDataElement).MaxmimumMinutes = +conditionalProperty.MaxmimumMinutes;
            }
          }

          return this.nonRelevantDataElementIds;
        } else {
          if (dataelement.dataElementType === 'ChoiceDataElement') {
            (dataelement as ChoiceDataElement).ChoiceNotRelevant = new Array<string>();
          }
          if (dataelement.dataElementType === 'MultiChoiceDataElement') {
            (dataelement as ChoiceDataElement).ChoiceNotRelevant = new Array<string>();
          }
        }
      }
    } else {
      // temp code
      // if (this.nonRelevantDataElementIds.length === 0) {
      //   dataelement.isRequired = true;
      // }
    }
  }

  private isCondtionMet(): boolean {
    for (const dataelement of this.template.dataElements) {
      if (dataelement.conditionalProperties !== undefined) {
        let conditionMet = false;
        let isCompositeCondition = false;
        for (const conditionalProperty of dataelement.conditionalProperties) {
          if (conditionalProperty.condition !== undefined) {
            conditionMet = conditionalProperty.condition.evaluate(new DataElementValues(this.dataElementValues));
            isCompositeCondition = false;
          } else if (conditionalProperty.compositeCondition !== undefined) {
            conditionMet = conditionalProperty.compositeCondition.evaluate(new DataElementValues(this.dataElementValues));
            isCompositeCondition = true;
          }

          if (conditionMet) {
            return true;
          }

          return false;
        }
      }
    }
  }

  evaluateDecisionAndConditionalProperty(): Array<string> {
    this.nonRelevantDataElementIds = new Array<string>();
    this.RevertConditionValues();
    for (const dataelement of this.template.dataElements) {
      this.evaluateConditionalProperty(dataelement, new Array<string>());
    }

    this.resetValuesOfNonRelevantDataElements(this.nonRelevantDataElementIds);
    return this.nonRelevantDataElementIds;
  }

  private RevertConditionValues() {
    for (const dataelement of this.template.dataElements) {
      dataelement.isRequired = dataelement.isRequiredOverrider;
      dataelement.displaySequence = dataelement.displaySequenceOverrider;
      if (dataelement.dataElementType === 'NumericDataElement') {
        (dataelement as NumericDataElement).minimum = +(dataelement as NumericDataElement).minimumOverrider;
        (dataelement as NumericDataElement).maximum = +(dataelement as NumericDataElement).maximumOverrider;
      }
      if (dataelement.dataElementType === 'IntegerDataElement') {
        (dataelement as IntegerDataElement).minimum = +(dataelement as IntegerDataElement).minimumOverrider;
        (dataelement as IntegerDataElement).maximum = +(dataelement as IntegerDataElement).maximumOverrider;
      }

      if (dataelement.dataElementType === 'DurationDataElement') {
        (dataelement as DurationDataElement).MinimumDay = +(dataelement as DurationDataElement).MinimumDayOverrider;
        (dataelement as DurationDataElement).MaximumDay = +(dataelement as DurationDataElement).MaximumDayOverrider;
        (dataelement as DurationDataElement).MinimumHours = +(dataelement as DurationDataElement).MinimumHoursOverrider;
        (dataelement as DurationDataElement).MaximumHours = +(dataelement as DurationDataElement).MaximumHoursOverrider;
        (dataelement as DurationDataElement).MinimumMinutes = +(dataelement as DurationDataElement).MinimumMinutesOverrider;
        (dataelement as DurationDataElement).MaxmimumMinutes = +(dataelement as DurationDataElement).MaxmimumMinutesOverrider;
      }
    }
  }

  private GetRepeatableValue(repeatCount) {
    const $dataElement = _.find(this.template.dataElements, { 'id': repeatCount }) as BaseDataElement;
    return $dataElement !== undefined ? $dataElement.currentValue : 0;
  }

  private RemoveManuallyAddedBranches() {
    for (const decisionPoint of this.template.rules.decisionPoints) {
      _.remove(decisionPoint.branches, { isManuallyAdded: true });
    }
  }

  private RemoveManuallyAddedComputedDataElements() {
    _.remove(this.template.dataElements, { isManuallyAdded: true });
  }

  private ProcessRepetationDataElements() {
    this.AddRepeatableBranchesInsideRule();
    this.AddRepeatableComputedDataElement();
    this.AddRepeatableTemplatePartials();
  }

  private AddRepeatableTemplatePartials() {
      for (const templatePartial of this.template.endpoint.templatePartials) {

      }
  }

  private AddRepeatableComputedDataElement() {
    this.RemoveManuallyAddedComputedDataElements();
    for (const decisionPoint of this.template.rules.decisionPoints) {
      for (const branch of decisionPoint.branches) {
        if (branch.isManuallyAdded) {
          let dataElementId_org = '';
          let dataElementId_dynamic = '';
          if (branch.condition !== undefined && typeof (branch.condition) === 'object') {
            dataElementId_org = branch.condition.conditionType.dataElementId.split('_')[0];
            dataElementId_dynamic = branch.condition.conditionType.dataElementId;
          }

          if (branch.condition === undefined && branch.compositeCondition !== undefined) {
            for (let _index = 0; _index < branch.compositeCondition.conditions.length; _index++) {
              dataElementId_org = branch.compositeCondition.conditions[_index].conditionType.dataElementId.split('_')[0];
              dataElementId_dynamic = branch.compositeCondition.conditions[_index].conditionType.dataElementId;
            }
          }

          if (dataElementId_org !== '' || dataElementId_dynamic !== '') {
            if (_.find(this.template.dataElements, { id: dataElementId_dynamic }) === undefined) {
              const computedDataElement = _.find(this.template.dataElements, { id: dataElementId_org }) as ComputedDataElement;
              if (computedDataElement.dataElementType === 'ComputedDataElement') {
                const $computedDataElement_cloned = _.cloneDeep(computedDataElement) as ComputedDataElement;
                $computedDataElement_cloned.id = dataElementId_dynamic;
                $computedDataElement_cloned.isManuallyAdded = true;
                const dataElementIds = this.template.dataElements.map(dataElement => dataElement.id);
                for (let index = 0; index < computedDataElement.decisionPoints.length; index++) {
                  $computedDataElement_cloned.decisionPoints[index].branches = [];
                  for (let $branchModified of computedDataElement.decisionPoints[index].branches) {
                    for (const _dataElement of dataElementIds) {
                      $branchModified = this.replacePropertyValue(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + dataElementId_dynamic.split('_')[1], $branchModified);
                      $branchModified = this.replaceTextExpression(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + dataElementId_dynamic.split('_')[1], $branchModified);
                    }

                    $branchModified.isManuallyAdded = true;
                    $computedDataElement_cloned.decisionPoints[index].branches.push($branchModified);
                  }
                }

                this.template.dataElements.push($computedDataElement_cloned);
              }
            }
          }
        }
      }

      console.log('test');
      console.log(this.template);
      // console.log(RepeatableElementRegisterService.GetRepeatableDataElementsGroupNames());
    }
  }

  replaceTextExpression(prevVal, newVal, object) {
    const newObject = _.clone(object);
    _.each(object, (val, key) => {
      if (val instanceof ArithmeticExpression) {
        newObject[key].expressionText = newObject[key].expressionText.replace(prevVal, newVal);
      }
    });

    return newObject;
  }

  replacePropertyValue(prevVal, newVal, object) {
    const newObject = _.clone(object);
    _.each(object, (val, key) => {
      if (val === prevVal) {
        newObject[key] = newVal;
      } else if (typeof (val) === 'object' || val instanceof Array) {
        newObject[key] = this.replacePropertyValue(prevVal, newVal, val);
      }
    });

    return newObject;
  }

  private AddRepeatableBranchesInsideRule() {
    this.RemoveManuallyAddedBranches();
    for (const decisionPoint of this.template.rules.decisionPoints) {
      for (const branch of decisionPoint.branches) {
        if (branch.endPointRef.isRepeatable && (branch.isManuallyAdded === undefined || !branch.isManuallyAdded)) {
          const $currentValue = +this.GetRepeatableValue(branch.endPointRef.repeatCount);
          if ($currentValue !== undefined && $currentValue > 0) {
            for (let index = 0; index < $currentValue; index++) {
              const $repeatGroupName = branch.endPointRef.repeatGroup;
              const $branch = _.cloneDeep(branch);
              $branch.isManuallyAdded = true;
              $branch.endPointRef.isRepeatable = false;

              if (branch.condition !== undefined && typeof (branch.condition) === 'object') {
                $branch.condition.conditionType.dataElementId = branch.condition.conditionType.dataElementId.split('_')[0]
                  + '_' + $repeatGroupName + (index + 1);
              }

              if ($branch.condition === undefined && $branch.compositeCondition !== undefined) {
                for (let _index = 0; _index < branch.compositeCondition.conditions.length; _index++) {
                  $branch.compositeCondition.conditions[_index].conditionType.dataElementId =
                    branch.compositeCondition.conditions[_index].conditionType.dataElementId + + '_' + $repeatGroupName + (index + 1);
                }
              }

              decisionPoint.branches.push($branch);
            }
          }
        }
      }
    }
  }

  private evaluateDecisionPoints() {
    this.ProcessRepetationDataElements();
    this.evaluateComputedExpressions();
    this.endOfRoadReached = false;
    for (const decisionPoint of this.template.rules.decisionPoints) {
      if (this.evaluateDecisionPoint(decisionPoint, 1)) {
        break;
      }
    }
  }

  initialize(template: Template) {
    this.template = template;
    for (const dataElement of this.template.dataElements) {
      this.dataElementValues[dataElement.id] = dataElement.currentValue;
    }
  }
}
