import { EqualCondition } from './equal-condition';
import { DataElementValues } from '../dataelementvalues';
import { ConditionType } from '../models/conditiontype.model';

describe('EqualCondition Class', () => {

  let dataElementValues: DataElementValues;
  let conditionType: ConditionType;
  let instance: EqualCondition;

  beforeEach(() => {
    createConditions();
    instance = new EqualCondition(conditionType);
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

  function createConditions() {
    conditionType = new ConditionType();
    conditionType.dataElementId = 'washout';
    conditionType.comparisonValue = 'No';
  }

  it('Created the EqualCondition class', () => {
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
    expect(returnValue).toBeTruthy();
  });
});
