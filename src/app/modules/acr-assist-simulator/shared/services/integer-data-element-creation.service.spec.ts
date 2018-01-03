import { TestBed, inject } from '@angular/core/testing';

import { IntegerDataElementCreationService } from './integer-data-element-creation.service';

describe('IntegerDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntegerDataElementCreationService]
    });
  });

  it('should be created', inject([IntegerDataElementCreationService], (service: IntegerDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
