import { TestBed, inject } from '@angular/core/testing';

import { ChoiceDataElementCreationService } from './choice-data-element-creation.service';

describe('ChoiceDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChoiceDataElementCreationService]
    });
  });

  it('should be created', inject([ChoiceDataElementCreationService], (service: ChoiceDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
