import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistChoiceElementComponent } from './assist-choice-element.component';

describe('AssistChoiceElementComponent', () => {
  let component: AssistChoiceElementComponent;
  let fixture: ComponentFixture<AssistChoiceElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistChoiceElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistChoiceElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
