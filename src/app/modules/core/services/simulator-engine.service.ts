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
const expressionParser = require('expr-eval').Parser;

@Injectable()
export class SimulatorEngineService {

  private template: Template;
  private dataElementValues: Map<string, any>;
  private dataElementTexts: Map<string, any>;
  private endOfRoadReached = false;
  private lastConditionMetBranchLevel = 1;
  private nonRelevantDataElementIds = new Array<string>();

  simulatorStateChanged = new BehaviorSubject<SimulatorState>(new SimulatorState());

  constructor(private ruleEngineService: RuleEngineService) {
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
      $simulatorState.ruleEvaluationResults =  this.ruleEngineService.EvaluateRules(this.template, endpoints, this.dataElementValues);
      this.simulatorStateChanged.next($simulatorState);
    } else {
      this.simulatorStateChanged.next($simulatorState);
    }
  }

  private resetValuesOfNonRelevantDataElements(nonRelevantDataElementIds: string[]) {
    // console.log(this.template.dataElements);
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

  // initialize(template: Template) {
  //   this.template = template;
  // }

  //  private evaluateDecisionPoints() {
  //   // new Array<string>()
  //   this.evaluateComputedExpressions();
  //   this.endOfRoadReached = false;
  //   for (const decisionPoint of this.template.rules.decisionPoints) {
  //     if (this.evaluateDecisionPoint(decisionPoint, 1)) {
  //       break;
  //     }
  //   }
  // }

  private evaluateDecisionPoints() {
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
