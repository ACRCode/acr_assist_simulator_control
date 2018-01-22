import { TestBed, inject } from '@angular/core/testing';

import { NumericDataElementCreationService } from './numeric-data-element-creation.service';

describe('NumericDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumericDataElementCreationService]
    });
  });

  it('should be created', inject([NumericDataElementCreationService], (service: NumericDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
