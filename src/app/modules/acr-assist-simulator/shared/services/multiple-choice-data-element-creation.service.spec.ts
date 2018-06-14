import { TestBed, inject } from '@angular/core/testing';

import { MultipleChoiceDataElementCreationService } from './multiple-choice-data-element-creation.service';
import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';

describe('MultipleChoiceDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultipleChoiceDataElementCreationService, DiagramService, ArrayCheckerService]
    });
  });

  it('should be created', inject([MultipleChoiceDataElementCreationService], (service: MultipleChoiceDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
