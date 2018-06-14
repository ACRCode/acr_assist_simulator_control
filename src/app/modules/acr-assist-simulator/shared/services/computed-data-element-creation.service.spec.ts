import { TestBed, inject } from '@angular/core/testing';

import { ComputedDataElementCreationService } from './computed-data-element-creation.service';
import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';
import { DecisionPointsCreationService } from './decision-points-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { ConditionsCreationService } from './conditions-creation.service';

describe('ComputedDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComputedDataElementCreationService, DiagramService, ArrayCheckerService,
                  DecisionPointsCreationService, ComputedValueCreationService, ConditionsCreationService]
    });
  });

  it('should be created', inject([ComputedDataElementCreationService], (service: ComputedDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
