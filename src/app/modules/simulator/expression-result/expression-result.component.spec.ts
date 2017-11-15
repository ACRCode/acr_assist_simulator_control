import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionResultComponent } from './expression-result.component';
import { ReportTextComponent } from '../report-text/report-text.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ExpressionResultComponent', () => {
  let component: ExpressionResultComponent;
  let fixture: ComponentFixture<ExpressionResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule
      ],
      declarations: [ ExpressionResultComponent , ReportTextComponent ]
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
