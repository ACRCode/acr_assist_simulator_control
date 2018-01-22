import { TestBed, inject } from '@angular/core/testing';

import { ArrayCheckerService } from './array-checker.service';

describe('ArrayCheckerSeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArrayCheckerService]
    });
  });

  it('should be created', inject([ArrayCheckerService], (service: ArrayCheckerService) => {
    expect(service).toBeTruthy();
  }));
});
