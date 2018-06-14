import { AndCondition } from './and-condition';
import { DataElementValues } from '../dataelementvalues';
import { EqualCondition } from './equal-condition';
import { ConditionType } from '../models/conditiontype.model';

describe('AndCondition Class', () => {

  let conditions: any;
  let dataElementValues: DataElementValues;
  let conditionType: ConditionType;
  let instance: AndCondition;

  beforeEach(() => {
    instance = new AndCondition();
    createConditionsWithMatchingValue();
  });

  afterEach(() => {
    conditions = undefined;
    dataElementValues = undefined;
    conditionType = undefined;
    instance = undefined;
  });

  function createDataElementValues() {
    dataElementValues = new DataElementValues(new Map<string, any>());
    dataElementValues.addOrUpdate('ArterialEnhancement', undefined);
    dataElementValues.addOrUpdate('DiameterLarge', 20);
    dataElementValues.addOrUpdate('DiameterSmall', 30);
    dataElementValues.addOrUpdate('adjustcategorybasedonAncillary', 'No');
    dataElementValues.addOrUpdate('capsule', 'No');
    dataElementValues.addOrUpdate('washout', 'No');
  }

  function createConditionsWithMatchingValue() {
    conditions = [];
    conditionType = new ConditionType();
    conditionType.dataElementId = 'washout';
    conditionType.comparisonValue = 'No';
    conditions.push(new EqualCondition(conditionType));

    conditionType = new ConditionType();
    conditionType.dataElementId = 'capsule';
    conditionType.comparisonValue = 'No';
    conditions.push(new EqualCondition(conditionType));

    instance.conditions = conditions;
  }

  function createConditionsWithUnMatchingValue() {
    conditions = [];
    conditionType = new ConditionType();
    conditionType.dataElementId = 'washout';
    conditionType.comparisonValue = 'Yes';
    conditions.push(new EqualCondition(conditionType));

    instance.conditions = conditions;
  }

  it('Created the AndCondition class', () => {
    expect(instance).toBeTruthy();
  });

  it('Called evaluate(dataElementValues) with invalid values', () => {
    const evaluate = function () {
      try {
        instance.evaluate(dataElementValues);
      } catch (error) {
        throw error;
      }
    };

    expect(evaluate).toThrow();
  });

  it('Called evaluate(dataElementValues) with valid values and matching data element values', () => {
    createDataElementValues();

    const returnValue = instance.evaluate(dataElementValues);

    expect(returnValue).toBeDefined();
    expect(returnValue).toBeTruthy();
  });

  it('Called evaluate(dataElementValues) with valid values and unmatching data element values', () => {
    createDataElementValues();
    createConditionsWithUnMatchingValue();

    const returnValue = instance.evaluate(dataElementValues);

    expect(returnValue).toBeDefined();
    expect(returnValue).toBeFalsy();
  });
});
