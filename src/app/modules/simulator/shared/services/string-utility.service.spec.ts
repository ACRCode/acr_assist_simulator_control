import { TestBed, inject } from '@angular/core/testing';
import { StringUtilityService } from './string-utility.service';



describe('UtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StringUtilityService]
    });
  });

  it('should be created', inject([StringUtilityService], (service: StringUtilityService) => {
    expect(service).toBeTruthy();
  }));
});
