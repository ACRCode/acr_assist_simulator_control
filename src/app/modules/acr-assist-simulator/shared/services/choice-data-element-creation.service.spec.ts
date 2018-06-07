import { TestBed, inject } from '@angular/core/testing';

import { ChoiceDataElementCreationService } from './choice-data-element-creation.service';
import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';

describe('ChoiceDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChoiceDataElementCreationService, DiagramService, ArrayCheckerService]
    });
  });

  it('should be created', inject([ChoiceDataElementCreationService], (service: ChoiceDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
