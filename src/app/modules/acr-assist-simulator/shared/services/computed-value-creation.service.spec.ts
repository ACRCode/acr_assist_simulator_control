import { TestBed, inject } from '@angular/core/testing';

import { ComputedValueCreationService } from './computed-value-creation.service';

describe('ComputedValueCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComputedValueCreationService]
    });
  });

  it('should be created', inject([ComputedValueCreationService], (service: ComputedValueCreationService) => {
    expect(service).toBeTruthy();
  }));
});
