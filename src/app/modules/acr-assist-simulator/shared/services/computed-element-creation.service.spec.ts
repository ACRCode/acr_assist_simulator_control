import { TestBed, inject } from '@angular/core/testing';

import { ComputedElementCreationService } from './computed-element-creation.service';

describe('ComputedElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComputedElementCreationService]
    });
  });

  it('should be created', inject([ComputedElementCreationService], (service: ComputedElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
