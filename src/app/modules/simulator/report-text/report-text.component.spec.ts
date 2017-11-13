import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTextComponent } from './report-text.component';

describe('ReportTextComponent', () => {
  let component: ReportTextComponent;
  let fixture: ComponentFixture<ReportTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
