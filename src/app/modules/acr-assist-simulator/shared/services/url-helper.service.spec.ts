import { TestBed } from '@angular/core/testing';

import { UrlHelperService } from './url-helper.service';

describe('UrlHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UrlHelperService = TestBed.get(UrlHelperService);
    expect(service).toBeTruthy();
  });
});
