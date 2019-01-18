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
// import { RepeatableElementRegisterService } from '../../acr-assist-simulator/shared/services/repeatable-element-register.service';
const expressionParser = require('expr-eval').Parser;
import * as _ from 'lodash';
import { BaseDataElement } from '../elements/models/base-data-element.model';
import { Branch } from '../models/branch.model';
import { EndPointRef } from '../models/endpointref.model';
import { EndpointItem } from '../endpoint/endpoint-item.model';
import { InsertPartial } from '../rules/models/insertpartial.model';
import { InsertValue } from '../rules/models/insertvalue.model';
import { TemplatePartial } from '../endpoint/template-partial';
import { ComputedDataElementId } from '../models/computed-dataelement-id.model';
import { RuleEvaluationResult } from '../endpoint/rule-evaluation-result.model';

@Injectable()
export class SimulatorEngineService {
  private ComputedDataElementIds = new Array<ComputedDataElementId>();
  private template: Template;
  private dataElementValues: Map<string, any>;
  private dataElementTexts: Map<string, any>;
  private endOfRoadReached = false;
  private lastConditionMetBranchLevel = 1;
  private nonRelevantDataElementIds = new Array<string>();
  private DynamicallyTemplatePartialIds = [];
  private ruleEvaluationResult = new Array<RuleEvaluationResult>();
  private endpoints = [];
  private branchCounter = 0;

  simulatorStateChanged = new BehaviorSubject<SimulatorState>(new SimulatorState());

  constructor(private ruleEngineService: RuleEngineService,
    // private repeatableElementRegisterService: RepeatableElementRegisterService
  ) {
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
    let endpoints = Array<string>();
    const endpointBranches = Array<Branch>();
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

      // && !branch.endPointRef.isRepeatable
      if (conditionMet) {
        this.lastConditionMetBranchLevel = branchingLevel;
        if (branch.decisionPoints !== undefined) {
          for (const branchDecisionPoint of branch.decisionPoints) {
            const newBranchingLevel = branchingLevel + 1;
            this.evaluateDecisionPoint(branchDecisionPoint, newBranchingLevel);
          }
        } else if (branch.endPointRef !== undefined) {
          endpointBranches.push(branch);
          endpoints.push(branch.endPointRef.endPointId);
          // reportCounts.push(branch.endPointRef.repeatCount);
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

    endpoints = this.ValidateEndpoints(endpointBranches);
    if (endpoints !== undefined && endpoints.length > 0) {
      this.endpoints = endpoints;
      const results = this.ruleEngineService.EvaluateRules(this.template, endpoints, this.dataElementValues);
      for (const _result of results) {
        this.ruleEvaluationResult.push(_result);
      }

      // this.simulatorStateChanged.next($simulatorState);
    } else {
      // this.simulatorStateChanged.next($simulatorState);
    }
  }

  private ValidateEndpoints(endpointBranches: Branch[]) {
    const $endpoints = new Array<string>();
    for (const endpointBranch of endpointBranches) {
      if (endpointBranch.isManuallyAdded) {
        if (this.dataElementValues[endpointBranch.endPointRef.repeatCount] !== '') {
          $endpoints.push(endpointBranch.endPointRef.endPointId);
        }
      } else {
        $endpoints.push(endpointBranch.endPointRef.endPointId);
      }
    }

    return $endpoints;
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
          // this.endOfRoadReached = true;
          if (branch.computedValue instanceof ArithmeticExpression) {
            this.dataElementValues[elementId] = this.evaluateArithmeticExpression(branch.computedValue.expressionText);
            // this.endOfRoadReached = true;
          } else {
            if (this.IsExpressionReferedtoComputedDataElement(branch.computedValue.expressionText)) {
              this.FindAndSetValueForComputedDataElement(branch.computedValue.expressionText, elementId);
              // this.evaluateComputedElementDecisionPoint(elementId, decisionPoint, branchingLevel);
              // this.endOfRoadReached = true;
            } else {
              this.dataElementValues[elementId] = branch.computedValue.expressionText;
              // this.endOfRoadReached = true;
            }
          }

          break;
        }
      } else {
        if (currentBranchCount >= totalBranchesInDecisionPoint) {
          // this.endOfRoadReached = true;
          this.dataElementValues[elementId] = undefined;
          return;
        } else {
          continue;
        }
      }
    }
  }

  private FindAndSetValueForComputedDataElement(expressionText, parentelementId) {
    const elementId = expressionText.match(/{([^}]+)}/);
    const result = this.template.dataElements.filter(function (obj) {
      return obj.id === elementId[1] && (obj.dataElementType === 'ComputedDataElement');
    });

    if (result !== undefined && result != null && result.length > 0) {
      const computedElement: ComputedDataElement = result[0] as ComputedDataElement;
      for (const decisionPoint of computedElement.decisionPoints) {
        this.dataElementValues[parentelementId] = this.dataElementValues[computedElement.id];
      }
    }
  }

  private IsExpressionReferedtoComputedDataElement(expressionText): boolean {
    const text = expressionText.match(/{([^}]+)}/);
    if (text !== null && text !== undefined && text.length > 0) {
      const result = this.template.dataElements.filter(function (obj) {
        return obj.id === text[1] && (obj.dataElementType === 'ComputedDataElement');
      });

      if (result != null && result !== undefined && result.length > 0) {
        return true;
      }
    }

    return false;
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
              const expressionText = decisionPoint.defaultBranch.computedValue.expressionText;
              if (this.IsExpressionReferedtoComputedDataElement(expressionText)) {
                this.FindAndSetValueForComputedDataElement(expressionText, element.id);
              } else {
                this.dataElementValues[element.id] = expressionText;
              }
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

  private RemoveDynamicallyAddedComputedDataElementIds() {
    this.ComputedDataElementIds = [];
  }

  private RemoveManuallyAddedBranches() {
    for (const decisionPoint of this.template.rules.decisionPoints) {
      _.remove(decisionPoint.branches, { isManuallyAdded: true });
    }
  }

  private RemoveManuallyAddedComputedDataElements() {
    _.remove(this.template.dataElements, { isManuallyAdded: true });
  }

  private RemoveManuallyAddedEndPoints() {
    _.remove(this.template.endpoint.endpoints, { isManuallyAdded: true });
  }

  private RemoveManuallyAddedTemplatePartials() {
    _.remove(this.template.endpoint.templatePartials, { isManuallyAdded: true });
  }

  private ProcessRepetationDataElements() {
    this.AddRepeatableBranchesInsideRule();
    this.AddRepeatableComputedDataElement();
    this.AddRepeatableEndpoints();
    this.AddRepeatableTemplatePartials();
  }

  private AddRepeatableTemplatePartials() {
    this.RemoveManuallyAddedTemplatePartials();
    for (const templatePartialId of this.DynamicallyTemplatePartialIds) {
      const templatePartialId_org = templatePartialId.split('_')[0];
      const templatePartial_org = _.filter(this.template.endpoint.templatePartials, { id: templatePartialId_org })[0];
      if (templatePartial_org !== undefined) {
        const templatePartial_cloned = _.cloneDeep(templatePartial_org) as TemplatePartial;
        templatePartial_cloned.id = templatePartialId;
        templatePartial_cloned.isManuallyAdded = true;
        let $conditions = [];
        for (const _branch of templatePartial_cloned.branches) {
          if (_branch.compositeCondition !== undefined) {
            const dataElementIds = this.template.dataElements.map(dataElement => dataElement.id);
            $conditions = [];

            // for (let index = 0; index < _branch.compositeCondition.conditions.length; index++) {
            //   if (_branch.compositeCondition.conditions[index].isManuallyAdded === undefined || _branch.compositeCondition.conditions[index].isManuallyAdded){
            //     for (const _dataElement of dataElementIds) {
            //       _branch.compositeCondition.conditions[index] = this.replacePropertyValue(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + templatePartialId.split('_')[1], _branch.compositeCondition.conditions[index]);
            //     }
            //   }
            // }

            for (let _conditions of _branch.compositeCondition.conditions) {
              if (_conditions.isManuallyAdded === undefined || !_conditions.isManuallyAdded) {
                for (const _dataElement of dataElementIds) {
                  _conditions = this.replacePropertyValue(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + templatePartialId.split('_')[1], _conditions);
                }
              }

              _conditions.isManuallyAdded = true;
              $conditions.push(_conditions);
            }

            _branch.compositeCondition.conditions = $conditions;
            // _branch.compositeCondition.conditions.push($conditions);
          }

          if (_branch.condition !== undefined && typeof (_branch.condition) === 'object') {
            _branch.condition.conditionType.dataElementId = _branch.condition.conditionType.dataElementId.split('_')[0]
              + '_' + templatePartialId.split('_')[1];
          }

          for (const reportText of _branch.reportText) {
            const $reportText = reportText.GetPropertyType();
            if ($reportText instanceof InsertPartial) {
              reportText.insertPartial.partialId = reportText.insertPartial.manupulateId(templatePartialId.split('_')[1]);
            }

            if ($reportText instanceof InsertValue) {
              reportText.insertValue.dataElementId = reportText.insertValue.manupulateId(templatePartialId.split('_')[1]);
            }
          }
        }

        this.template.endpoint.templatePartials.push(templatePartial_cloned);
      }
    }
  }

  private AddRepeatableEndpoints() {
    this.DynamicallyTemplatePartialIds = [];
    this.RemoveManuallyAddedEndPoints();
    let dynamicEndPoints = [];
    for (const decisionPoint of this.template.rules.decisionPoints) {
      dynamicEndPoints = _.filter(decisionPoint.branches, { isManuallyAdded: true });
    }

    for (const dynamicEndpoint of dynamicEndPoints) {
      const endpoint_org = _.filter(this.template.endpoint.endpoints, { id: dynamicEndpoint.endPointRef.endPointId.split('_')[0] })[0];
      const endpoint_cloned = _.cloneDeep(endpoint_org) as EndpointItem;
      endpoint_cloned.id = dynamicEndpoint.endPointRef.endPointId;
      endpoint_cloned.isManuallyAdded = true;

      const dynamicId = dynamicEndpoint.endPointRef.endPointId.split('_')[1];
      for (const reportSection of endpoint_cloned.reportSections) {
        for (const _branch of reportSection.branch) {

          if (_branch.compositeCondition !== undefined) {
            const dataElementIds = this.template.dataElements.map(dataElement => dataElement.id);
            // _branch.compositeCondition.conditions = [];
            for (let _conditions of _branch.compositeCondition.conditions) {
              if (_conditions.isManuallyAdded === undefined || !_conditions.isManuallyAdded) {
                for (const _dataElement of dataElementIds) {
                  _conditions = this.replacePropertyValue(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + dynamicId, _conditions);
                }
              }

              _conditions.isManuallyAdded = true;
              _branch.compositeCondition.conditions.push(_conditions);
            }
          }

          if (_branch.condition !== undefined && typeof (_branch.condition) === 'object') {
            _branch.condition.conditionType.dataElementId = _branch.condition.conditionType.dataElementId.split('_')[0]
              + '_' + dynamicId;
          }

          for (const reportText of _branch.reportText) {
            const $reportText = reportText.GetPropertyType();
            if ($reportText instanceof InsertPartial) {
              reportText.insertPartial.partialId = reportText.insertPartial.manupulateId(dynamicId);
              this.DynamicallyTemplatePartialIds.push(reportText.insertPartial.partialId);
            }

            if ($reportText instanceof InsertValue) {
              reportText.insertValue.dataElementId = reportText.insertValue.manupulateId(dynamicId);
            }
          }
        }
      }

      this.template.endpoint.endpoints.push(endpoint_cloned);
      console.log(endpoint_cloned);
    }

    // console.log(dynamicEndPoints);
  }



  private AddRepeatableComputedDataElement() {
    this.RemoveManuallyAddedComputedDataElements();

    for (const computedDataElementId of this.ComputedDataElementIds) {
      const dataElementId_org = computedDataElementId.dataElementId_org;
      const dataElementId_dynamic = computedDataElementId.dataElememntId_dynamic;

      if (dataElementId_org !== '' || dataElementId_dynamic !== '') {
        if (_.find(this.template.dataElements, { id: dataElementId_dynamic }) === undefined) {
          const computedDataElement = _.find(this.template.dataElements, { id: dataElementId_org }) as ComputedDataElement;
          if (computedDataElement !== undefined && computedDataElement.dataElementType === 'ComputedDataElement') {
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

    // for (const decisionPoint of this.template.rules.decisionPoints) {
    //   for (const branch of decisionPoint.branches) {
    //     if (branch.isManuallyAdded) {
    //       let dataElementId_org = '';
    //       let dataElementId_dynamic = '';
    //       if (branch.condition !== undefined && typeof (branch.condition) === 'object') {
    //         dataElementId_org = branch.condition.conditionType.dataElementId.split('_')[0];
    //         dataElementId_dynamic = branch.condition.conditionType.dataElementId;
    //       }

    //       if (branch.condition === undefined && branch.compositeCondition !== undefined) {
    //         for (let _index = 0; _index < branch.compositeCondition.conditions.length; _index++) {
    //           dataElementId_org = branch.compositeCondition.conditions[_index].conditionType.dataElementId.split('_')[0];
    //           dataElementId_dynamic = branch.compositeCondition.conditions[_index].conditionType.dataElementId;
    //         }
    //       }

    //       if (dataElementId_org !== '' || dataElementId_dynamic !== '') {
    //         if (_.find(this.template.dataElements, { id: dataElementId_dynamic }) === undefined) {
    //           const computedDataElement = _.find(this.template.dataElements, { id: dataElementId_org }) as ComputedDataElement;
    //           if (computedDataElement !== undefined && computedDataElement.dataElementType === 'ComputedDataElement') {
    //             const $computedDataElement_cloned = _.cloneDeep(computedDataElement) as ComputedDataElement;
    //             $computedDataElement_cloned.id = dataElementId_dynamic;
    //             $computedDataElement_cloned.isManuallyAdded = true;
    //             const dataElementIds = this.template.dataElements.map(dataElement => dataElement.id);
    //             for (let index = 0; index < computedDataElement.decisionPoints.length; index++) {
    //               $computedDataElement_cloned.decisionPoints[index].branches = [];
    //               for (let $branchModified of computedDataElement.decisionPoints[index].branches) {
    //                 for (const _dataElement of dataElementIds) {
    //                   $branchModified = this.replacePropertyValue(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + dataElementId_dynamic.split('_')[1], $branchModified);
    //                   $branchModified = this.replaceTextExpression(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + dataElementId_dynamic.split('_')[1], $branchModified);
    //                 }

    //                 $branchModified.isManuallyAdded = true;
    //                 $computedDataElement_cloned.decisionPoints[index].branches.push($branchModified);
    //               }
    //             }

    //             this.template.dataElements.push($computedDataElement_cloned);
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
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
    this.RemoveDynamicallyAddedComputedDataElementIds();
    for (const decisionPoint of this.template.rules.decisionPoints) {
      for (const branch of decisionPoint.branches) {
        if (branch.endPointRef !== undefined && branch.endPointRef.isRepeatable && (branch.isManuallyAdded === undefined || !branch.isManuallyAdded)) {
          const $currentValue = +this.GetRepeatableValue(branch.endPointRef.repeatCount);
          if ($currentValue !== undefined && $currentValue > 0) {
            for (let index = 0; index < $currentValue; index++) {
              const $repeatGroupName = branch.endPointRef.repeatGroup;
              const $branch = _.cloneDeep(branch);
              $branch.isManuallyAdded = true;
              if ($branch.endPointRef !== undefined) {
                $branch.endPointRef.isRepeatable = false;
                $branch.endPointRef.endPointId = branch.endPointRef.endPointId.split('_')[0]
                  + '_' + $repeatGroupName + (index + 1);
              }

              if ($branch.compositeCondition !== undefined) {
                const dataElementIds = this.template.dataElements.map(dataElement => dataElement.id);
                $branch.compositeCondition.conditions = [];
                for (let _conditions of branch.compositeCondition.conditions) {
                  for (const _dataElement of dataElementIds) {
                    _conditions = this.replacePropertyValue(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + $repeatGroupName + (index + 1), _conditions);
                    this.CheckIfDataElementisComputedDataElement(_dataElement.split('_')[0], _dataElement.split('_')[0] + '_' + $repeatGroupName + (index + 1));
                  }

                  $branch.compositeCondition.conditions.push(_conditions);
                }
              }

              if (branch.condition !== undefined && typeof (branch.condition) === 'object') {
                $branch.condition.conditionType.dataElementId = branch.condition.conditionType.dataElementId.split('_')[0]
                  + '_' + $repeatGroupName + (index + 1);
              }

              decisionPoint.branches.push($branch);
            }
          }
        }
      }
    }

    // console.log('wqe');
    // console.log(this.template);
  }

  private CheckIfDataElementisComputedDataElement(dataElementId_org, dataElementId_dynamic) {
    const $computedDataElement = new ComputedDataElementId();
    const computedDataElement = _.find(this.template.dataElements, { id: dataElementId_org }) as BaseDataElement;
    if (computedDataElement !== undefined && computedDataElement.dataElementType === 'ComputedDataElement') {
      $computedDataElement.dataElememntId_dynamic = dataElementId_dynamic;
      $computedDataElement.dataElementId_org = dataElementId_org;
      this.ComputedDataElementIds.push(Object.assign({}, $computedDataElement));
    }
  }

  private evaluateDecisionPoints() {
    this.ProcessRepetationDataElements();
    this.evaluateComputedExpressions();
    this.endOfRoadReached = false;
    this.branchCounter++;
    this.ruleEvaluationResult = [];
    this.endpoints = [];
    for (const decisionPoint of this.template.rules.decisionPoints) {
      this.evaluateDecisionPoint(decisionPoint, 1);
    }

    const $simulatorState = new SimulatorState();
    if (this.ruleEvaluationResult.length > 0) {
      $simulatorState.ruleEvaluationResults = new Array<RuleEvaluationResult>();
      for (const _ruleresult of this.ruleEvaluationResult) {
        $simulatorState.ruleEvaluationResults.push(_ruleresult);
      }

      for (const _endpoint of this.endpoints) {
        $simulatorState.endPointIds.push(_endpoint);
      }
    }

    this.simulatorStateChanged.next($simulatorState);
  }

  initialize(template: Template) {
    this.template = template;
    for (const dataElement of this.template.dataElements) {
      this.dataElementValues[dataElement.id] = dataElement.currentValue;
    }
  }
}
