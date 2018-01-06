import { Injectable } from '@angular/core';
import { Condition } from '../../../core/condition';
import { EqualCondition } from '../../../core/rules/equal-condition';
import { ConditionType } from '../../../core/models/conditiontype.model';
import { GreaterThanCondition } from '../../../core/rules/greater-than-condition';
import { LessThanCondition } from '../../../core/rules/less-than-condition';
import { GreaterThanOrEqualsCondition } from '../../../core/rules/greater-than-or-equals-condition';
import { LessThanOrEqualsCondition } from '../../../core/rules/less-than-or-equals-condition';
import { ContainsCondition } from '../../../core/rules/contains-condition';
import { CompositeCondition } from '../../../core/composite-condition';
import { AndCondition } from '../../../core/rules/and-condition';
import { OrCondition } from '../../../core/rules/or-condition';
import { ArrayCheckerService } from './array-checker.service';

@Injectable()
export class ConditionsCreationService {

   constructor(private  arrayCheckerService: ArrayCheckerService) { }

    private returnConditionType(conditionJSON: any): ConditionType {
      const conditionType = new ConditionType();
      conditionType.comparisonValue = conditionJSON.Attr.ComparisonValue;
      conditionType.dataElementId = conditionJSON.Attr.DataElementId;
      return conditionType;
    }




    returnCondition(branchJSON: any): Condition {
        let condition: Condition;
        if (branchJSON.hasOwnProperty('EqualCondition')) {
            condition = new EqualCondition(this.returnConditionType(branchJSON.EqualCondition));
        }
        if (branchJSON.hasOwnProperty('GreaterThanCondition')) {
          condition = new GreaterThanCondition(this.returnConditionType(branchJSON.GreaterThanCondition));
        }
        if (branchJSON.hasOwnProperty('LessThanCondition')) {
          condition = new LessThanCondition(this.returnConditionType(branchJSON.LessThanCondition));
        }
        if (branchJSON.hasOwnProperty('GreaterThanOrEqualsCondition')) {
          condition = new GreaterThanOrEqualsCondition(this.returnConditionType(branchJSON.GreaterThanOrEqualsCondition));
        }
        if (branchJSON.hasOwnProperty('LessThanOrEqualsCondition')) {
          condition = new LessThanOrEqualsCondition(this.returnConditionType(branchJSON.LessThanOrEqualsCondition));
        }
        if (branchJSON.hasOwnProperty('ContainsCondition')) {
          condition = new ContainsCondition(this.returnConditionType(branchJSON.ContainsCondition));
        }
        return condition;
    }

     isComposite(compositeElementJSON): boolean {
        return compositeElementJSON.hasOwnProperty('AndCondition') ||
        compositeElementJSON.hasOwnProperty('OrCondition');
    }

    private returnConditionFromJSON(considitionIdentifier: string , conditionJSON: any): Condition {
      let condition: Condition;
      if (considitionIdentifier === 'EqualCondition') {
          condition = new EqualCondition(this.returnConditionType(conditionJSON));
      }
      if (considitionIdentifier === 'GreaterThanCondition') {
        condition = new GreaterThanCondition(this.returnConditionType(conditionJSON));
      }
      if (considitionIdentifier === 'LessThanCondition') {
        condition = new LessThanCondition(this.returnConditionType(conditionJSON));
      }
      if (considitionIdentifier === 'GreaterThanOrEqualsCondition') {
        condition = new GreaterThanOrEqualsCondition(this.returnConditionType(conditionJSON));
      }
      if (considitionIdentifier === 'LessThanOrEqualsCondition') {
        condition = new LessThanOrEqualsCondition(this.returnConditionType(conditionJSON));
      }
      if (considitionIdentifier === 'ContainsCondition') {
        condition = new ContainsCondition(this.returnConditionType(conditionJSON));
      }
      return condition;
  }

    private  returnConditions(conditionsJSON: JSON): Condition[] {
         let conditions: Condition[];
        const conditionIdentifiers = ['EqualCondition', 'GreaterThanCondition', 'LessThanCondition',
            'GreaterThanOrEqualsCondition', 'LessThanOrEqualsCondition', 'ContainsCondition'];
        for (const conditionIdentifier of conditionIdentifiers) {
              const conditionJSON = conditionsJSON[conditionIdentifier];
              if (conditionJSON !== undefined) {
                conditions = new Array<Condition>();
                if (this.arrayCheckerService.isArray(conditionJSON)) {
                      for (const jsonValue of conditionJSON) {
                        conditions.push(this.returnConditionFromJSON(conditionIdentifier, jsonValue));
                      }
                } else {
                  conditions.push(this.returnConditionFromJSON(conditionIdentifier, conditionJSON));
                }
              }
        }
        return conditions;
    }


    returnCompositeCondition(data: any): CompositeCondition {
      if (!this.isComposite(data))  {
         return;
      }
      let compositeCondtionJSON: any;
      let compositeCondition: CompositeCondition;
      if (data.hasOwnProperty('AndCondition') ) {
          compositeCondtionJSON = data.AndCondition;
          compositeCondition = new AndCondition();
      } else if (data.hasOwnProperty('OrCondition')) {
         compositeCondtionJSON = data.OrCondition;
         compositeCondition = new OrCondition();
      }

      if (!this.isComposite(compositeCondtionJSON)) {
        compositeCondition.conditions.push(this.returnConditions(compositeCondtionJSON));
      } else {
        this.returnInnerConditions(compositeCondtionJSON, compositeCondition);
      }
      return compositeCondition;
    }

    private returnInnerConditions(innerConditionsJSON: any, compositeCondition: CompositeCondition) {
        let innerCompositionCondition: any;
        let compositeConditionJSON: any;
        if (innerConditionsJSON.hasOwnProperty('AndCondition') ) {
              innerCompositionCondition = new AndCondition();
              compositeConditionJSON = innerConditionsJSON.AndCondition;
        } else if (innerConditionsJSON.hasOwnProperty('OrCondition')) {
              innerCompositionCondition = new OrCondition();
              compositeConditionJSON = innerConditionsJSON.AndCondition;
        }
        compositeCondition.conditions.push(innerCompositionCondition);
        if (this.arrayCheckerService.isArray(compositeConditionJSON)) {
                for(const arrayItem of compositeConditionJSON){
                  if (!this.isComposite(arrayItem)) {
                    innerCompositionCondition.conditions.push(this.returnConditions(arrayItem));
                  } else {
                    this.returnInnerConditions(arrayItem, innerCompositionCondition);
                  }
                }
        }

    }
}
