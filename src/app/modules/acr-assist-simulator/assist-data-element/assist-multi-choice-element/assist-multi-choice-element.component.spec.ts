import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistMultiChoiceElementComponent } from './assist-multi-choice-element.component';

describe('AssistMultiChoiceElementComponent', () => {
  let component: AssistMultiChoiceElementComponent;
  let fixture: ComponentFixture<AssistMultiChoiceElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistMultiChoiceElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistMultiChoiceElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
