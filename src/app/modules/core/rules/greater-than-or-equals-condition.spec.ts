import { GreaterThanOrEqualsCondition } from './greater-than-or-equals-condition';
import { DataElementValues } from '../dataelementvalues';
import { ConditionType } from '../models/conditiontype.model';

describe('GreaterThanOrEqualsCondition Class', () => {

  let dataElementValues: DataElementValues;
  let conditionType: ConditionType;
  let instance: GreaterThanOrEqualsCondition;

  beforeEach(() => {
    createConditionsWithComparisonValueAsString();
    instance = new GreaterThanOrEqualsCondition(conditionType);
  });

  afterEach(() => {
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

  function createConditionsWithComparisonValueAsString() {
    conditionType = new ConditionType();
    conditionType.dataElementId = 'washout';
    conditionType.comparisonValue = 'No';
  }

  function createConditionsWithComparisonValueAsInteger() {
    conditionType = new ConditionType();
    conditionType.dataElementId = 'DiameterLarge';
    conditionType.comparisonValue = '5';
  }

  it('Created the GreaterThanOrEqualsCondition class', () => {
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

  it('Called evaluate(dataElementValues) with valid values', () => {
    createDataElementValues();

    const returnValue = instance.evaluate(dataElementValues);

    expect(returnValue).toBeDefined();
    expect(returnValue).toBeFalsy();
  });

  it('Called evaluate(dataElementValues) with valid values and data element type of number', () => {
    createDataElementValues();
    createConditionsWithComparisonValueAsInteger();
    instance.conditionType = conditionType;

    const returnValue = instance.evaluate(dataElementValues);

    expect(returnValue).toBeDefined();
    expect(returnValue).toBeTruthy();
  });
});
