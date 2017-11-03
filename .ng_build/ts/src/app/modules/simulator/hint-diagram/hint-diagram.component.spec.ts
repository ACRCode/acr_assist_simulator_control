import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HintDiagramComponent } from './hint-diagram.component';

describe('HintDiagramComponent', () => {
  let component: HintDiagramComponent;
  let fixture: ComponentFixture<HintDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HintDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HintDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
