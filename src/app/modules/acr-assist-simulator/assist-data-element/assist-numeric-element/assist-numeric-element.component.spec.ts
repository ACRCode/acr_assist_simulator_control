import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistNumericElementComponent } from './assist-numeric-element.component';

describe('AssistNumericElementComponent', () => {
  let component: AssistNumericElementComponent;
  let fixture: ComponentFixture<AssistNumericElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistNumericElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistNumericElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
