import { Injectable } from '@angular/core';
import { Template } from '../models/template.model';
import { SimulatorState } from '../models/simulator-state.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { DecisionPoint } from '../models/decisionpoint.model';
import { DataElementValues } from '../dataelementvalues';

@Injectable()
export class SimulatorEngineService {

  private template:  Template;
  private dataElementValues: Map<string, any>;

  simulatorStateChanged = new BehaviorSubject<SimulatorState>(new SimulatorState());

  constructor() {
    this. dataElementValues = new Map<string, any>();
  }

  getAllDataElementValues(): Map<string, any> {
    return this.dataElementValues;
  }

  getDataElementValue(dataElementId: string): any {
    return this.dataElementValues[dataElementId];
  }

  addOrUpdateDataElementValue(dataElementId: string, value: any) {
    this.dataElementValues[dataElementId] = value;
    this.evaluateDecisionPoints();
  }

  evaluateDecisionPoint(decisionPoint: DecisionPoint, nonRelevantDataElementIds: string[] , branchingLevel: number) {
     console.log( this.dataElementValues);
      let currentBranchCount = 0;
      for (const branch of decisionPoint.branches) {
       let conditionMet = false;
       if (branch.compositeCondition !== undefined) {
          conditionMet = branch.compositeCondition.evaluate(new DataElementValues(this.dataElementValues));
         } else if  (branch.condition !== undefined) {
         conditionMet = branch.condition.evaluate(new DataElementValues(this.dataElementValues));
       }
       console.log(branch.label + ', Branching Level :-'  , branchingLevel + ', Condition Met :-' + conditionMet);

       if (conditionMet) {
         if (nonRelevantDataElementIds === undefined) {
          nonRelevantDataElementIds = new Array<string>();
         }
         if ( branch.notRelevantDataElements !== undefined) {
          for (const nonRelevantDataElementReference of  branch.notRelevantDataElements.dataElementReferences ) {
            nonRelevantDataElementIds.push(nonRelevantDataElementReference.dataElementId);
          }
         }
         if (branch.decisionPoints !== undefined) {
            for (const branchDecisionPoint of branch.decisionPoints) {
                branchingLevel++;
                this.evaluateDecisionPoint(branchDecisionPoint, nonRelevantDataElementIds,branchingLevel);
           }
         } else if (branch.endPointRef !==  undefined) {
              const simulatorState = new SimulatorState();
              simulatorState.endPointId  = branch.endPointRef.endPointId;
              simulatorState.nonRelevantDataElementIds = nonRelevantDataElementIds;
              simulatorState.selectedBranchLabel = branch.label;
              simulatorState.selectedDecisionPointId = decisionPoint.id;
              simulatorState.selectedDecisionPointLabel = decisionPoint.label;
              this.resetValuesOfNonRelevantDataElements(nonRelevantDataElementIds);
              this.simulatorStateChanged.next(simulatorState);
              return;
         }
        } else {
          continue;
        }
        currentBranchCount++;
     }
  }

  private resetValuesOfNonRelevantDataElements(nonRelevantDataElementIds: string[]) {
     for (const nonRelevantDataElementId of nonRelevantDataElementIds)
     {
          let defaultValue: any;
           for (const dataElement of this.template.dataElements) {
              if (dataElement.id === nonRelevantDataElementId ) {
                 defaultValue = dataElement.defaultValue;
                 break;
              }
           }
          this.dataElementValues[nonRelevantDataElementId] = defaultValue;
     }
  }

  private evaluateDecisionPoints() {
      for (const decisionPoint of this.template.rules.decisionPoints)
      {
          this.evaluateDecisionPoint(decisionPoint, undefined, 1);
      }

  }

  initialize(template:  Template) {
    this.template = template;
    for (const dataElement of  this.template.dataElements) {
       this.dataElementValues[dataElement.id] = dataElement.currentValue;
    }
    console.log( this.dataElementValues);
  }


}