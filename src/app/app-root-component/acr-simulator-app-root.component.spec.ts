import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrSimulatorAppRootComponent } from './acr-simulator-app-root.component';

describe('AppRootComponentComponent', () => {
  let component: AcrSimulatorAppRootComponent;
  let fixture: ComponentFixture<AcrSimulatorAppRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcrSimulatorAppRootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcrSimulatorAppRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
