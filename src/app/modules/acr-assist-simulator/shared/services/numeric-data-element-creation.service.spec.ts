import { TestBed, inject } from '@angular/core/testing';

import { NumericDataElementCreationService } from './numeric-data-element-creation.service';
import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';

describe('NumericDataElementCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumericDataElementCreationService, DiagramService, ArrayCheckerService]
    });
  });

  it('should be created', inject([NumericDataElementCreationService], (service: NumericDataElementCreationService) => {
    expect(service).toBeTruthy();
  }));
});
