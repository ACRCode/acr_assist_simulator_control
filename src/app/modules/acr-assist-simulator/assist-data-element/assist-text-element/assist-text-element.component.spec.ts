import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssistTextElementComponent } from './assist-text-element.component';

describe('AssistTextElementComponent', () => {
  let component: AssistTextElementComponent;
  let fixture: ComponentFixture<AssistTextElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistTextElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistTextElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
