import { Injectable } from '@angular/core';
import { ConditionType, SectionIfCondition, SectionIfNotCondition } from 'testruleengine/Library/Models/Class';
import { ICondition, ICompositeCondition } from 'testruleengine/Library/Models/Interface';
import { EqualCondition } from '../../../core/rules/equal-condition';
import { GreaterThanCondition } from '../../../core/rules/greater-than-condition';
import { LessThanCondition } from '../../../core/rules/less-than-condition';
import { GreaterThanOrEqualsCondition } from '../../../core/rules/greater-than-or-equals-condition';
import { LessThanOrEqualsCondition } from '../../../core/rules/less-than-or-equals-condition';
import { ContainsCondition } from '../../../core/rules/contains-condition';
import { AndCondition } from '../../../core/rules/and-condition';
import { OrCondition } from '../../../core/rules/or-condition';
import { ArrayCheckerService } from './array-checker.service';
import { NotCondition } from '../../../core/rules/not-condition';
import { NotEqualCondition } from '../../../core/rules/not-equal-condition';

@Injectable()
export class ConditionsCreationService {
   constructor(private  arrayCheckerService: ArrayCheckerService) { }

    private returnConditionType(conditionJSON: any): ConditionType {
      const conditionType = new ConditionType();
      conditionType.comparisonValue = conditionJSON.Attr.ComparisonValue;
      conditionType.dataElementId = conditionJSON.Attr.DataElementId;
      return conditionType;
    }

    returnCondition(branchJSON: any): ICondition {
        let condition: ICondition;
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
        if (branchJSON.hasOwnProperty('SectionIf')) {
          condition = new SectionIfCondition(this.returnConditionType(branchJSON.SectionIf));
        }
        if (branchJSON.hasOwnProperty('SectionIfNot')) {
          condition = new SectionIfNotCondition(this.returnConditionType(branchJSON.SectionIfNot));
        }
        if (branchJSON.hasOwnProperty('NotEqualCondition')) {
          condition = new NotEqualCondition(this.returnConditionType(branchJSON.NotEqualCondition));
        }

        // if (condition !== undefined) {
        //   condition.IsRelevant = branchJSON.IsRelevant !== undefined
        //                          ? branchJSON.IsRelevant : false;
        // }
        // condition.IsRelevant = branchJSON.IsRelevant !== undefined
        //                               ? branchJSON.IsRelevant : true;
        return condition;
    }

     isComposite(compositeElementJSON): boolean {
        return compositeElementJSON.hasOwnProperty('AndCondition') ||
        compositeElementJSON.hasOwnProperty('OrCondition') ||
        compositeElementJSON.hasOwnProperty('NotCondition');
    }

    private returnConditionFromJSON(conditionIdentifier: string , conditionJSON: any): ICondition {
      let condition: ICondition;
      if (conditionIdentifier === 'EqualCondition') {
          condition = new EqualCondition(this.returnConditionType(conditionJSON));
      }
      if (conditionIdentifier === 'GreaterThanCondition') {
        condition = new GreaterThanCondition(this.returnConditionType(conditionJSON));
      }
      if (conditionIdentifier === 'LessThanCondition') {
        condition = new LessThanCondition(this.returnConditionType(conditionJSON));
      }
      if (conditionIdentifier === 'GreaterThanOrEqualsCondition') {
        condition = new GreaterThanOrEqualsCondition(this.returnConditionType(conditionJSON));
      }
      if (conditionIdentifier === 'LessThanOrEqualsCondition') {
        condition = new LessThanOrEqualsCondition(this.returnConditionType(conditionJSON));
      }
      if (conditionIdentifier === 'ContainsCondition') {
        condition = new ContainsCondition(this.returnConditionType(conditionJSON));
      }
      if (conditionIdentifier === 'SectionIf') {
        condition = new SectionIfCondition(this.returnConditionType(conditionJSON));
      }
      if (conditionIdentifier === 'SectionIfNot') {
        condition = new SectionIfNotCondition(this.returnConditionType(conditionJSON));
      }
      if (conditionIdentifier === 'NotEqualCondition') {
        condition = new NotEqualCondition(this.returnConditionType(conditionJSON));
      }

      return condition;
  }

    private  returnConditions(conditionsJSON: JSON): ICondition[] {
         const conditions = new  Array<ICondition>();
        const conditionIdentifiers = ['EqualCondition', 'GreaterThanCondition', 'LessThanCondition',
            'GreaterThanOrEqualsCondition', 'LessThanOrEqualsCondition', 'ContainsCondition', 'SectionIf', 'SectionIfNot', 'NotEqualCondition'];
        for (const conditionIdentifier of conditionIdentifiers) {
              const conditionJSON = conditionsJSON[conditionIdentifier];
              if (conditionJSON !== undefined) {
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

    isHybrid(compositeElementJSON): boolean {
      const compositeExists =  compositeElementJSON.hasOwnProperty('AndCondition') ||
      compositeElementJSON.hasOwnProperty('OrCondition') ||
      compositeElementJSON.hasOwnProperty('NotCondition');
      return compositeExists;
    }


    returnICompositeCondition(data: any): ICompositeCondition {
      if (!this.isComposite(data))  {
         return;
      }
      let ICompositeConditionJSON: any;
      let ICompositeCondition: ICompositeCondition;

      if (data.hasOwnProperty('AndCondition') ) {
          ICompositeConditionJSON = data.AndCondition;
          ICompositeCondition = new AndCondition();
      } else if (data.hasOwnProperty('OrCondition')) {
         ICompositeConditionJSON = data.OrCondition;
         ICompositeCondition = new OrCondition();
       } else if (data.hasOwnProperty('NotCondition')) {
        ICompositeConditionJSON = data.NotCondition;
        ICompositeCondition = new NotCondition();
     }

      if (!this.isComposite(ICompositeConditionJSON)) {
               ICompositeCondition.conditions = this.returnConditions(ICompositeConditionJSON);
      } else if (this.isHybrid(ICompositeConditionJSON)) {
           const jsonKeys = Object.keys(ICompositeConditionJSON);
         for (const jsonKey of jsonKeys) {
              const jsonValue =  ICompositeConditionJSON[jsonKey];
              const jsonString =  '{"' + jsonKey  + '":' + JSON.stringify(jsonValue) + '}' ;
              const jsonObject = JSON.parse(jsonString);
              if (this.isComposite(jsonObject)) {
                 this.returnInnerConditions(jsonObject, ICompositeCondition);
              } else {
                  if (this.arrayCheckerService.isArray(jsonValue)) {
                      for (const arrayValue of  jsonValue) {
                        ICompositeCondition.conditions.push(this.returnConditionFromJSON(jsonKey, arrayValue));
                      }

                  } else {
                    ICompositeCondition.conditions.push(this.returnConditionFromJSON(jsonKey, jsonValue));
                  }


              }
         }
      } else {
           this.returnInnerConditions(ICompositeConditionJSON, ICompositeCondition);
      }
     return ICompositeCondition;
    }


    returnICompositeConditionFromName(elementName: string): ICompositeCondition {
      let ICompositeCondition: ICompositeCondition;
      switch (elementName) {
          case  'AndCondition':
            {
            ICompositeCondition = new AndCondition();
            break;
            }
            case  'OrCondition':
            {
            ICompositeCondition = new OrCondition();
            break;
            }
            case 'NotCondition' :
            {
            ICompositeCondition = new NotCondition();
            }
      }
        return ICompositeCondition;

    }


    private  addConditionsToInnerConditions(key: any , value: any, ICompositeCondition: ICompositeCondition) {
      const condition = this.returnICompositeConditionFromName(key);
      ICompositeCondition.conditions.push(condition);
      if (this.isHybrid(value)) {
         const jsonKeys = Object.keys(value);
        for (const jsonKey of jsonKeys) {
             const jsonValue =  value[jsonKey];
             const jsonString =  '{"' + jsonKey  + '":' + JSON.stringify(jsonValue) + '}' ;
             const jsonObject = JSON.parse(jsonString);
             if (this.isComposite(jsonObject)) {
                this.returnInnerConditions(jsonObject, condition);
             } else {
                 if (this.arrayCheckerService.isArray(jsonValue)) {
                     for (const arrayValue of  jsonValue) {
                      condition.conditions.push(this.returnConditionFromJSON(jsonKey, arrayValue));
                     }

                 } else {
                  condition.conditions.push(this.returnConditionFromJSON(jsonKey, jsonValue));
                 }


             }
        }

      } else  if (this.isComposite(value)) {

      } else {
          condition.conditions = this.returnConditions(value);
      }
    }

    private returnInnerConditions(innerConditionsJSON: any, ICompositeCondition: ICompositeCondition) {
        const jsonKeys = Object.keys(innerConditionsJSON);
        for (const key of jsonKeys ) {
            const values = innerConditionsJSON[key];
            if (this.arrayCheckerService.isArray(values)) {
               for (const value of values) {
                   this.addConditionsToInnerConditions(key, value, ICompositeCondition);
               }
            } else {
                this.addConditionsToInnerConditions(key, innerConditionsJSON[key], ICompositeCondition);
              }
            }

        }
    }
