import { TestBed, inject } from '@angular/core/testing';

import { GlobalsService } from './globals.service';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Mock Service class for Global service
class MockGlobalService extends GlobalsService {

  getDefaultModulePath(): Observable<string>  {
    return new Observable(observer => {
      observer.next('sample data');
    });
  }
}

describe('GlobalService', () => {

  let mockedGlobalService: GlobalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ { provide: GlobalsService, useClass: MockGlobalService } ]
    });

    mockedGlobalService = TestBed.get(GlobalsService);
  });

  afterEach(() => {
    mockedGlobalService = undefined;
  });

  it('Created the Global service', inject([GlobalsService], (service: GlobalsService) => {
    expect(service).toBeTruthy();
  }));

  it('Created same instance type of Mocked Service and Original Service', () => {
    expect(mockedGlobalService instanceof GlobalsService).toBeTruthy();
  });

  it('Checks whether defaultModule variable is intialised', () => {
    expect(mockedGlobalService.defaultModule).toBeDefined();
    expect(mockedGlobalService.defaultModule).toBeTruthy();
  });

  it('Checks whether XMLList variable is intialised', () => {
    expect(mockedGlobalService.XMLList).toBeDefined();
    expect(mockedGlobalService.XMLList).toBeTruthy();
  });

  it('Called getDefaultModulePath() method to get default module details of observable response',
    (done: DoneFn) => {
      mockedGlobalService.getDefaultModulePath().subscribe(value => {
      expect(value).toBeDefined();
      expect(value).toBeTruthy();
      expect(value).toEqual('sample data');
      done();
    });
  });

});
