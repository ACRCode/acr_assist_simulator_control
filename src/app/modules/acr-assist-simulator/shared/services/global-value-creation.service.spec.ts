import { TestBed, inject } from '@angular/core/testing';

import { GlobalValueCreationService } from './global-value-creation.service';

describe('GlobalValueCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalValueCreationService]
    });
  });

  it('should be created', inject([GlobalValueCreationService], (service: GlobalValueCreationService) => {
    expect(service).toBeTruthy();
  }));
});
