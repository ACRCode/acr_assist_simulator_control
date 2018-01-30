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
  private endOfRoadReached = false;
  private lastConditionMetBranchLevel = 1;

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

  evaluateDecisionPoint(decisionPoint: DecisionPoint,  branchingLevel, nonRelevantDataElementIds: string[] = []) {
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
          } else if  (branch.condition !== undefined) {
            conditionMet = branch.condition.evaluate(new DataElementValues(this.dataElementValues));
           }


         // console.log('Branch:- ' + branch.label + ', My Branching Level:-' +  branchingLevel  + ', Last Condition Met Branch Level :-' +
         //  this.lastConditionMetBranchLevel + ', Condition Met :- ' + conditionMet  + ', endOfRoadReached' + this.endOfRoadReached);
        if (conditionMet) {
          this.lastConditionMetBranchLevel =  branchingLevel;
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
                const newBranchingLevel = branchingLevel + 1;
                this.evaluateDecisionPoint(branchDecisionPoint,  newBranchingLevel,  nonRelevantDataElementIds);
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
              this.endOfRoadReached = true;
              break;
         }
        } else {
            if (currentBranchCount >= totalBranchesInDecisionPoint) {
                 this.endOfRoadReached  = true;
                 const simulatorState = new SimulatorState();
                 simulatorState.nonRelevantDataElementIds = nonRelevantDataElementIds;
                 this.resetValuesOfNonRelevantDataElements(nonRelevantDataElementIds);
                 this.simulatorStateChanged.next(simulatorState);
                 return;
           } else {
            continue;
           }
        }

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
     this.endOfRoadReached = false;
      for (const decisionPoint of this.template.rules.decisionPoints)
      {

        if ( this.evaluateDecisionPoint(decisionPoint, 1 , new Array<string>())) {
          break;
        }
      }

  }

  initialize(template:  Template) {
    this.template = template;
    console.log(this.template);

    for (const dataElement of  this.template.dataElements) {
       this.dataElementValues[dataElement.id] = dataElement.currentValue;
    }
  }


}
