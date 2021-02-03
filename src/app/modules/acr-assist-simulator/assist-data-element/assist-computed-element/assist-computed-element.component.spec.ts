import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssistComputedElementComponent } from './assist-computed-element.component';

describe('AssistComputedElementComponent', () => {
  let component: AssistComputedElementComponent;
  let fixture: ComponentFixture<AssistComputedElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistComputedElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistComputedElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
