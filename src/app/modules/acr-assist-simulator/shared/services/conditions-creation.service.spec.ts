import { TestBed, inject } from '@angular/core/testing';

import { ConditionsCreationService } from './conditions-creation.service';
import { ArrayCheckerService } from './array-checker.service';

describe('ConditionsCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConditionsCreationService, ArrayCheckerService]
    });
  });

  it('should be created', inject([ConditionsCreationService], (service: ConditionsCreationService) => {
    expect(service).toBeTruthy();
  }));
});
