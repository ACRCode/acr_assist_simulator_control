import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionDisplayComponent } from './version-display.component';

describe('VersionDisplayComponent', () => {
  let component: VersionDisplayComponent;
  let fixture: ComponentFixture<VersionDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
