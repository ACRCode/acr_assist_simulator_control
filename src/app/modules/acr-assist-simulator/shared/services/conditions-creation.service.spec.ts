import { TestBed, inject } from '@angular/core/testing';

import { ConditionsCreationService } from './conditions-creation.service';

describe('ConditionsCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConditionsCreationService]
    });
  });

  it('should be created', inject([ConditionsCreationService], (service: ConditionsCreationService) => {
    expect(service).toBeTruthy();
  }));
});
