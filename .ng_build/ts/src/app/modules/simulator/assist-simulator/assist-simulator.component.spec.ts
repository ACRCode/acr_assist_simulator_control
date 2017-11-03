import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistSimulatorComponent } from './assist-simulator.component';

describe('AssistSimulatorComponent', () => {
  let component: AssistSimulatorComponent;
  let fixture: ComponentFixture<AssistSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
