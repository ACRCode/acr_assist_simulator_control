import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrSimulatorNotFoundComponent } from './acr-simulator-not-found.component';

describe('AcrSimulatorNotFoundComponent', () => {
  let component: AcrSimulatorNotFoundComponent;
  let fixture: ComponentFixture<AcrSimulatorNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcrSimulatorNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcrSimulatorNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
