import { TestBed, inject } from '@angular/core/testing';

import { RulesCreationService } from './rules-creation.service';

describe('RulesCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RulesCreationService]
    });
  });

  it('should be created', inject([RulesCreationService], (service: RulesCreationService) => {
    expect(service).toBeTruthy();
  }));
});
