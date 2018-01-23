import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistReportTextComponent } from './assist-report-text.component';

describe('AssistReportTextComponent', () => {
  let component: AssistReportTextComponent;
  let fixture: ComponentFixture<AssistReportTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistReportTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistReportTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
