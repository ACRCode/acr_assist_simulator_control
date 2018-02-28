import { TestBed, inject } from '@angular/core/testing';

import { ComputedDataElementCreationService } from './computed-data-element-creation.service';

describe('ComputedDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComputedDataElementCreationService]
    });
  });

  it('should be created', inject([ComputedDataElementCreationService], (service: ComputedDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
