import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpresssionBlockComponent } from './expresssion-block.component';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionResultComponent } from '../expression-result/expression-result.component';
import { ReportTextComponent } from '../report-text/report-text.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


describe('ExpresssionBlockComponent', () => {
  let component: ExpresssionBlockComponent;
  let fixture: ComponentFixture<ExpresssionBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule
      ],
      declarations: [ ExpresssionBlockComponent , ExpressionResultComponent, ReportTextComponent],
      providers : [GlobalsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpresssionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
