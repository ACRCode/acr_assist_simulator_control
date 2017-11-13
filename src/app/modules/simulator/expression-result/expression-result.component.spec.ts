import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionResultComponent } from './expression-result.component';

describe('ExpressionResultComponent', () => {
  let component: ExpressionResultComponent;
  let fixture: ComponentFixture<ExpressionResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressionResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
