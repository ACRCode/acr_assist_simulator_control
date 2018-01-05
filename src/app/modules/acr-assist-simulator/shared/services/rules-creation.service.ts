import { Injectable } from '@angular/core';
import { Rules } from '../../../core/rules/rules.model';
import { ArrayCheckerService } from './array-checker.service';
import { DecisionPoint } from '../../../core/rules/decisionpoint.model';
import { Branch } from '../../../core/rules/branch';
import { EndPointRef } from '../../../core/rules/models/endpointref.model';
import { DataElementRef } from '../../../core/rules/models/dataelementref.model';
import { NotRelevantDataElements } from '../../../core/rules/models/notrelevantdataelements.model';
import { ConditionsCreationService } from './conditions-creation.service';

@Injectable()
export class RulesCreationService {

  constructor(private arrayCheckerService: ArrayCheckerService , private conditionsCreationService: ConditionsCreationService) {

  }

  private createRelevantDataElementReferences(dataElementRefJSON): DataElementRef     {
      const dataElementRef = new DataElementRef();
      dataElementRef.dataElementId = dataElementRefJSON.Attr.DataElementId;
      return dataElementRef;
  }


  private  returnBranch(branchJSON): Branch {
    const branch = new Branch();
    branch.label = branchJSON.Label;
    if (branchJSON.EndPointRef) {
      branch.endPointRef = new EndPointRef();
      branch.endPointRef.endPointId = branchJSON.EndPointRef.Attr.EndPointId;
    }
    branch.condition = this.conditionsCreationService.returnCondition(branchJSON);
    branch.compositeCondition =this.conditionsCreationService.returnCompositeCondition(branchJSON);
     if (branchJSON.NotRelevantDataElements) {
          const notRelevantDataElements = new NotRelevantDataElements();
          notRelevantDataElements.dataElementRefrences = new Array<DataElementRef>();
          const dataElementRefs = branchJSON.NotRelevantDataElements.DataElementRef;
          if (this.arrayCheckerService.isArray(dataElementRefs)) {
              for (const dataElementRefJSON of  dataElementRefs) {
                notRelevantDataElements.dataElementRefrences.push(this.createRelevantDataElementReferences(dataElementRefJSON));
              }
          } else {
            notRelevantDataElements.dataElementRefrences.push(dataElementRefs);
          }
    }
    return branch;
  }


  private addDecisionPoint(decsionPointAsJSON: any , decisionPoints: DecisionPoint[]) {
     const decisionPoint = new DecisionPoint();
     decisionPoint.id = decsionPointAsJSON.Attr.Id;
     decisionPoint.label = decsionPointAsJSON.Label;
     const branchesJSON = decsionPointAsJSON.Branch;
     if (branchesJSON !== undefined) {
      decisionPoint.branches = new Array<Branch>();
      if (this.arrayCheckerService.isArray(branchesJSON))  {
        for (const branchJSON of branchesJSON) {
          decisionPoint.branches.push(this.returnBranch(branchJSON));
        }
       } else {
        decisionPoint.branches.push(this.returnBranch(branchesJSON));
      }
     }
     decisionPoints.push(decisionPoint);
  }

  private addDecisionPoints(decsionPointsAsJSON: any , decisionPoints: DecisionPoint[]) {
    if (this.arrayCheckerService.isArray(decsionPointsAsJSON)) {
        for (const decisionPoint of  decsionPointsAsJSON){
          this.addDecisionPoint(decisionPoint, decisionPoints);
        }
    } else {
      this.addDecisionPoint(decsionPointsAsJSON, decisionPoints);
    }
  }

  createRules(data: any): Rules {
    const rules = new Rules();
    const decsionPointAsJSON = data.DecisionPoint;
    const decisionPoints = new Array<DecisionPoint>();
    this.addDecisionPoints(decsionPointAsJSON, decisionPoints);
    rules.decisionPoints = decisionPoints;
    return rules;
  }
}
