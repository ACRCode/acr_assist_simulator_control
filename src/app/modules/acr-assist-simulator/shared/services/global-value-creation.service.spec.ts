import { TestBed, inject } from '@angular/core/testing';

import { GlobalValueCreationService } from './global-value-creation.service';
import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';

describe('GlobalValueCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalValueCreationService, DiagramService, ArrayCheckerService]
    });
  });

  it('should be created', inject([GlobalValueCreationService], (service: GlobalValueCreationService) => {
    expect(service).toBeTruthy();
  }));
});
