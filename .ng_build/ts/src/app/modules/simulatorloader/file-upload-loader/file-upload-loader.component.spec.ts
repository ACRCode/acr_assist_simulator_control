import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadLoaderComponent } from './file-upload-loader.component';

describe('FileUploadLoaderComponent', () => {
  let component: FileUploadLoaderComponent;
  let fixture: ComponentFixture<FileUploadLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
