import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistDateTimeElementComponent } from './assist-date-time-element.component';

describe('AssistDateTimeElementComponent', () => {
  let component: AssistDateTimeElementComponent;
  let fixture: ComponentFixture<AssistDateTimeElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistDateTimeElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistDateTimeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
