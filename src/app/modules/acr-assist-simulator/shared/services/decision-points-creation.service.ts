import { Injectable } from '@angular/core';
import { Rules } from '../../../core/rules/models/rules.model';
import { ArrayCheckerService } from './array-checker.service';
import { DecisionPoint } from '../../../core/models/decisionpoint.model';
import { Branch } from '../../../core//models/branch.model';
import { EndPointRef } from '../../../core/models/endpointref.model';
import { DataElementRef } from '../../../core/models/dataelementref.model';
import { NotRelevantDataElements } from '../../../core/models/notrelevantdataelements.model';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';

@Injectable()
export class DecisionPointsCreationService {

  constructor(private arrayCheckerService: ArrayCheckerService ,
    private conditionsCreationService: ConditionsCreationService,
  private computedValueCreationService: ComputedValueCreationService ) {

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
      branch.endPointRef.isRepeatable = branchJSON.EndPointRef.Attr.IsRepeatable === 'true' ? true : false;
      branch.endPointRef.repeatGroup = branchJSON.EndPointRef.Attr.RepeatGroup;
      branch.endPointRef.repeatCount = branchJSON.EndPointRef.Attr.RepeatCount;
    }
    
    branch.condition = this.conditionsCreationService.returnCondition(branchJSON);
    branch.computedValue = this.computedValueCreationService.createComputedValue(branchJSON);
    if (this.conditionsCreationService.isComposite(branchJSON)) {
      debugger;
         branch.compositeCondition = this.conditionsCreationService.returnCompositeCondition(branchJSON);
    }
    if (branchJSON.NotRelevantDataElements) {
           const notRelevantDataElements = new NotRelevantDataElements();
          notRelevantDataElements.dataElementReferences = new Array<DataElementRef>();
          const dataElementRefs = branchJSON.NotRelevantDataElements.DataElementRef;
          if (this.arrayCheckerService.isArray(dataElementRefs)) {
              for (const dataElementRefJSON of  dataElementRefs) {
                notRelevantDataElements.dataElementReferences.push(this.createRelevantDataElementReferences(dataElementRefJSON));
              }
          } else {
            notRelevantDataElements.dataElementReferences.push(this.createRelevantDataElementReferences(dataElementRefs));
          }
          branch.notRelevantDataElements = notRelevantDataElements;
    }
    if (branchJSON.DecisionPoint) {
       branch.decisionPoints = new Array<DecisionPoint>();
       this.addDecisionPoints(branchJSON.DecisionPoint,  branch.decisionPoints);
    }
    return branch;
  }


  private addDecisionPoint(decsionPointAsJSON: any , decisionPoints: DecisionPoint[]) {
     const decisionPoint = new DecisionPoint();
      if (decsionPointAsJSON.Attr && decsionPointAsJSON.Attr.Id) {
        decisionPoint.id = decsionPointAsJSON.Attr.Id;
     }
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
      const defaultBranchJSON = decsionPointAsJSON.DefaultBranch;
      if (defaultBranchJSON !== undefined) {
        decisionPoint.defaultBranch = this.createDefaultBranch(defaultBranchJSON);
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

  createDecisionPoints(data: any): DecisionPoint[] {
    const decisionPoints = new Array<DecisionPoint>();
    this.addDecisionPoints(data, decisionPoints);
    return decisionPoints;
  }


  createDefaultBranch(data: any): Branch {
    const defaultBranch: Branch  = new Branch();
    defaultBranch.label =  'Default Branch';
    defaultBranch.computedValue = this.computedValueCreationService.createComputedValue(data);
    return defaultBranch;
  }
}
