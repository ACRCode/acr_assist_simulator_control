import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { ViewUploadLoaderComponent } from './view-upload-loader.component';
import { FileUploadLoaderComponent } from '../file-upload-loader/file-upload-loader.component';
import { GlobalsService } from '../shared/services/globals.service';
import { HttpModule } from '@angular/http';
import { FileDetails } from '../shared/models/file-details.model';
import { Observable } from 'rxjs/Observable';

// Mock Service class for Global service
class MockGlobalService extends GlobalsService {

  getDefaultModulePath(): Observable<string>  {
    return new Observable(observer => {
      observer.next('sample data');
    });
  }
}

describe('ViewUploadLoaderComponent', () => {
  let component: ViewUploadLoaderComponent;
  let fixture: ComponentFixture<ViewUploadLoaderComponent>;
  let nativeElement: any;
  let mockGlobalService: GlobalsService;
  let mockData: FileDetails;
  let selectedXML: FileDetails;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [ ViewUploadLoaderComponent, FileUploadLoaderComponent ],
      providers: [GlobalsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.overrideComponent(FileUploadLoaderComponent, {
      set: { providers: [{ provide: GlobalsService, useClass: MockGlobalService }]}
    });

    // create component and test fixture
    fixture = TestBed.createComponent(ViewUploadLoaderComponent);

     // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement;

    // GlobalsService provided to the TestBed
    mockGlobalService = TestBed.get(GlobalsService);

    mockData = new FileDetails('sample', 'sample.xml', 'sample data');

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement = undefined;
    mockGlobalService = undefined;
    mockData = undefined;
    selectedXML = undefined;
  });

  it('Created the ViewUploadLoaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Created same instance for the Service injected via inject() and TestBed.get()',
      inject([GlobalsService], (injectService: GlobalsService) => {
        expect(injectService).toBe(mockGlobalService);
  }));

  it('Called onFileContentRead(fileDetails: FileDetails) method to get the xml details of a newly selected module', () => {
    component.onFileSelected.subscribe(data => {
      selectedXML = data;
     });

    component.onFileContentRead(mockData);

    expect(selectedXML.fileLabel).toBe(mockData.fileLabel);
    expect(selectedXML.fileName).toBe(mockData.fileName);
    expect(selectedXML.fileContents).toBe(mockData.fileContents);
    expect(mockGlobalService.XMLList).toBeDefined();
    expect(mockGlobalService.XMLList.ContainsKey(mockData.fileLabel));
    expect(mockGlobalService.XMLList).toBeTruthy();
  });

  it('Called onFileContentRead(fileDetails: FileDetails) method to get the xml details of an existing selected module', () => {
    component.onFileSelected.subscribe(data => {
      selectedXML = data;
     });

    mockGlobalService.XMLList.Add(mockData.fileLabel, mockData);
    component.onFileContentRead(mockData);
    expect(selectedXML.fileLabel).toBe(mockData.fileLabel);
    expect(selectedXML.fileName).toBe(mockData.fileName);
    expect(selectedXML.fileContents).toBe(mockData.fileContents);
    expect(mockGlobalService.XMLList).toBeDefined();
    expect(mockGlobalService.XMLList.ContainsKey(mockData.fileLabel));
    expect(mockGlobalService.XMLList).toBeTruthy();
  });

  it('Called onFileClick(fileDetails: FileDetails) method to show the selected xml details', () => {
    component.onFileSelected.subscribe(data => {
      selectedXML = data;
     });

    component.onFileClick(mockData);

    expect(selectedXML.fileLabel).toEqual(mockData.fileLabel);
    expect(selectedXML.fileName).toEqual(mockData.fileName);
    expect(selectedXML.fileContents).toEqual(mockData.fileContents);
    expect(mockGlobalService.XMLList).toBeDefined();
    expect(mockGlobalService.XMLList.ContainsKey(mockData.fileLabel));
    expect(mockGlobalService.XMLList).toBeTruthy();
  });

});
