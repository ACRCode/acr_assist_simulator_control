import { TestBed, inject } from '@angular/core/testing';

import { DecisionPointsCreationService } from './decision-points-creation.service';

describe('DecisionPointsCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DecisionPointsCreationService]
    });
  });

  it('should be created', inject([DecisionPointsCreationService], (service: DecisionPointsCreationService) => {
    expect(service).toBeTruthy();
  }));
});
