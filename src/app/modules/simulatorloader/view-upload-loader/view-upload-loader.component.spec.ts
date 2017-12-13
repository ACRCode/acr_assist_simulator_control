import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUploadLoaderComponent } from './view-upload-loader.component';

describe('view-upload-loaderComponent', () => {
  let component: ViewUploadLoaderComponent;
  let fixture: ComponentFixture<ViewUploadLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUploadLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUploadLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
