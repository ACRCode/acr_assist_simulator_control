import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { FileUploadLoaderComponent } from './file-upload-loader.component';
import { GlobalsService } from '../shared/services/globals.service';
import { HttpModule } from '@angular/http';
import { FileDetails } from '../shared/models/file-details.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

// Mock Service class for Global service
class MockGlobalService extends GlobalsService {

  getDefaultModulePath(): Observable<string>  {
    return new Observable(observer => {
      observer.next('sample data');
    });
  }
}

describe('FileUploadLoaderComponent', () => {
  let component: FileUploadLoaderComponent;
  let fixture: ComponentFixture<FileUploadLoaderComponent>;
  let nativeElement: any;
  let mockGlobalService: GlobalsService;
  let inputFile: DebugElement;
  let invalidMessageElement: any;
  let fileDetails: FileDetails;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [FileUploadLoaderComponent],
      providers: [GlobalsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.overrideComponent(FileUploadLoaderComponent, {
      set: { providers: [{ provide: GlobalsService, useClass: MockGlobalService }]}
    });

    // create component and test fixture
    fixture = TestBed.createComponent(FileUploadLoaderComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement;

    // GlobalsService provided to the TestBed
    mockGlobalService = TestBed.get(GlobalsService);

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement = undefined;
    mockGlobalService = undefined;
    inputFile = undefined;
    invalidMessageElement = undefined;
    fileDetails = undefined;
  });

  it('Created the FileUploadLoaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Created same instance for the Service injected via inject() and TestBed.get()',
      inject([GlobalsService], (injectService: GlobalsService) => {
        expect(injectService).toBe(mockGlobalService);
  }));

  it('Called hideMessage() method to hide the invalid file message', () => {
    component.hideMessage();
    invalidMessageElement  = fixture.debugElement.query(By.css('#xmlOnlyMsg')).nativeElement;
    expect(invalidMessageElement.style.display).toBeDefined();
    expect(invalidMessageElement.style.display).toBeTruthy();
    expect(invalidMessageElement.style.display).toBe('none');
  });

  it('Called showDefaultModule() method to load the default module', (done: DoneFn) => {
    component.onFileContentRead.subscribe(data => {
      fileDetails = data;
      invalidMessageElement  = fixture.debugElement.query(By.css('#xmlOnlyMsg')).nativeElement;

      expect(fileDetails).toBeDefined();
      expect(fileDetails.fileLabel).toBeDefined();
      expect(fileDetails.fileLabel).toBeTruthy();
      expect(fileDetails.fileLabel).toBe('Hello Assist');
      expect(fileDetails.fileName).toBeDefined();
      expect(fileDetails.fileName).toBeTruthy();
      expect(fileDetails.fileName).toBe('Hello_Assist.xml');
      expect(fileDetails.fileContents).toBeDefined();
      expect(fileDetails.fileContents).toBeTruthy();
      expect(invalidMessageElement.style.display).toBeDefined();
      expect(invalidMessageElement.style.display).toBeTruthy();
      expect(invalidMessageElement.style.display).toBe('none');
      done();
     });

    component.showDefaultModule();
  });

  it('Called changeListener($event) method for invalid file', () => {
    inputFile = fixture.debugElement.query(By.css('input[type=file]'));
    const file = new File([new ArrayBuffer(2e+5)], 'sample-file.jpg', { lastModified: null, type: 'image/jpeg' });
    const event = { target : { value: 'C:\fakepath\sample-file.jpg', files: [file] } };
    inputFile.triggerEventHandler('change', event);

    invalidMessageElement  = fixture.debugElement.query(By.css('#xmlOnlyMsg')).nativeElement;
    expect(invalidMessageElement.style.display).toBeDefined();
    expect(invalidMessageElement.style.display).toBeFalsy();
    expect(invalidMessageElement.style.display).toBe('');
  });

  it('Called changeListener($event) method for Valid file', (done: DoneFn) => {
    inputFile = fixture.debugElement.query(By.css('input[type=file]'));
    const file = new File([new ArrayBuffer(2e+5)], 'sample-file.xml', { lastModified: null, type: 'text/xml' });
    const event = { target : { value: 'C:\fakepath\sample-file.xml', files: [file] } };

    component.onFileContentRead.subscribe(data => {
      fileDetails = data;
      invalidMessageElement  = fixture.debugElement.query(By.css('#xmlOnlyMsg')).nativeElement;

      expect(fileDetails).toBeDefined();
      expect(fileDetails.fileLabel).toBeTruthy();
      expect(fileDetails.fileLabel).toBeDefined();
      expect(fileDetails.fileLabel).toEqual('sample-file');
      expect(fileDetails.fileName).toBeTruthy();
      expect(fileDetails.fileName).toBeDefined();
      expect(fileDetails.fileName).toEqual('sample-file.xml');
      expect(fileDetails.fileContents).toBeTruthy();
      expect(fileDetails.fileContents).toBeDefined();
      expect(fileDetails.fileContents).toBeDefined();
      expect(invalidMessageElement.style.display).toBeDefined();
      expect(invalidMessageElement.style.display).toBeTruthy();
      expect(invalidMessageElement.style.display).toEqual('none');
      done();
     });

    component.changeListener(event);
  });

  it('Called readThis(inputValue: any) method for Valid file', (done: DoneFn) => {
    const file = new File([new ArrayBuffer(2e+5)], 'sample-file.xml', { lastModified: null, type: 'text/xml' });
    const event = { target : { value: 'C:\fakepath\sample-file.xml', files: [file] } };

    component.onFileContentRead.subscribe(data => {
      fileDetails = data;

      expect(fileDetails).toBeDefined();
      expect(fileDetails.fileLabel).toBeTruthy();
      expect(fileDetails.fileLabel).toBeDefined();
      expect(fileDetails.fileLabel).toBe('sample-file');
      expect(fileDetails.fileName).toBeTruthy();
      expect(fileDetails.fileName).toBeDefined();
      expect(fileDetails.fileName).toBe('sample-file.xml');
      expect(fileDetails.fileContents).toBeTruthy();
      expect(fileDetails.fileContents).toBeDefined();
      done();
     });

    component.readThis(event.target);
  });

});
