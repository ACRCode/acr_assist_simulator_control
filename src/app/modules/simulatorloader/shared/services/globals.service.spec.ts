import { TestBed, inject } from '@angular/core/testing';

import { GlobalsService } from './globals.service';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Mock Service class for Global service
class MockGlobalService extends GlobalsService {

  defaultModule = 'assets/XMLFIles/hello_assist/Hello_Assist.xml';
  getDefaultModulePath(): Observable<string>  {
    return new Observable(observer => {
      observer.next('sample data');
    });
  }
}

describe('GlobalsService', () => {

  let mockedService: GlobalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ { provide: GlobalsService, useClass: MockGlobalService } ]
    });

    mockedService = TestBed.get(GlobalsService);
  });

  afterEach(() => {
    mockedService = null;
  });

  it('Created the Global service', inject([GlobalsService], (service: GlobalsService) => {
    expect(service).toBeTruthy();
  }));

  it('Created same instance type of Mocked Service and Original Service', () => {
    expect(mockedService instanceof GlobalsService).toBeTruthy();
  });

  it('Checks whether defaultModule variable is intialised', () => {
    expect(mockedService.defaultModule).toBeDefined();
    expect(mockedService.defaultModule).toBeTruthy();
  });

  it('Checks whether XMLList variable is intiated', () => {
    expect(mockedService.XMLList).toBeDefined();
    expect(mockedService.XMLList).toBeTruthy();
  });

  it('Called getDefaultModulePath() method to get default module details of observable response',
    (done: DoneFn) => {
      mockedService.getDefaultModulePath().subscribe(value => {
      expect(value).toBeDefined();
      expect(value).toBeTruthy();
      expect(value).toBe('sample data');
      done();
    });
  });

});
