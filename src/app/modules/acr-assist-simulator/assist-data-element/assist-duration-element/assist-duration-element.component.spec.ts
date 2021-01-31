import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssistDurationElementComponent } from './assist-duration-element.component';

describe('AssistDurationElementComponent', () => {
  let component: AssistDurationElementComponent;
  let fixture: ComponentFixture<AssistDurationElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistDurationElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistDurationElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
