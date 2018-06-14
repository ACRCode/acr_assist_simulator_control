import { NotCondition } from './not-condition';
import { DataElementValues } from '../dataelementvalues';
import { ConditionType } from '../models/conditiontype.model';
import { EqualCondition } from './equal-condition';

describe('NotCondition Class', () => {

  let conditions: any;
  let dataElementValues: DataElementValues;
  let conditionType: ConditionType;
  let instance: NotCondition;

  beforeEach(() => {
    instance = new NotCondition();
    createConditions();
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

  function createConditions() {
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

  it('Created the NotCondition class', () => {
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
});
