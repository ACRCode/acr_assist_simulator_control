import { TestBed, inject } from '@angular/core/testing';

import { DecisionPointsCreationService } from './decision-points-creation.service';
import { ArrayCheckerService } from './array-checker.service';
import { ConditionsCreationService } from './conditions-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';

describe('DecisionPointsCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DecisionPointsCreationService, ArrayCheckerService, ConditionsCreationService, ComputedValueCreationService]
    });
  });

  it('should be created', inject([DecisionPointsCreationService], (service: DecisionPointsCreationService) => {
    expect(service).toBeTruthy();
  }));
});
