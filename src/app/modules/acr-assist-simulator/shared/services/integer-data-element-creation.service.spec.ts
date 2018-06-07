import { TestBed, inject } from '@angular/core/testing';

import { IntegerDataElementCreationService } from './integer-data-element-creation.service';
import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';

describe('IntegerDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntegerDataElementCreationService, DiagramService, ArrayCheckerService]
    });
  });

  it('should be created', inject([IntegerDataElementCreationService], (service: IntegerDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
