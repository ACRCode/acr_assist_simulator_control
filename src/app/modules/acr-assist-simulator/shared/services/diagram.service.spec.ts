import { TestBed, inject } from '@angular/core/testing';

import { DiagramService } from './diagram.service';
import { ArrayCheckerService } from './array-checker.service';

describe('DiagramService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiagramService, ArrayCheckerService]
    });
  });

  it('should be created', inject([DiagramService], (service: DiagramService) => {
    expect(service).toBeTruthy();
  }));
});
