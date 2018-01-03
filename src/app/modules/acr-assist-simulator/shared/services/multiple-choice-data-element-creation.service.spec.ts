import { TestBed, inject } from '@angular/core/testing';

import { MultipleChoiceDataElementCreationService } from './multiple-choice-data-element-creation.service';

describe('MultipleChoiceDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultipleChoiceDataElementCreationService]
    });
  });

  it('should be created', inject([MultipleChoiceDataElementCreationService], (service: MultipleChoiceDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
