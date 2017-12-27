import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrAssistSimulatorComponent } from './acr-assist-simulator.component';

describe('AcrAssistSimulatorComponent', () => {
  let component: AcrAssistSimulatorComponent;
  let fixture: ComponentFixture<AcrAssistSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcrAssistSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcrAssistSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
