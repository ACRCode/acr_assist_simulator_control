import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataElementComponent } from './data-element.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComputedElementComponent } from '../computed-element/computed-element.component';
import { HintDiagramComponent } from '../hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../image-map/image-map.component';
import { ExpresssionBlockComponent } from '../expresssion-block/expresssion-block.component';
import { ValueBlockComponent } from '../value-block/value-block.component';
import { ExpressionResultComponent } from '../expression-result/expression-result.component';
import { ReportTextComponent } from '../report-text/report-text.component';
import { StringUtilityService } from '../shared/services/string-utility.service';

describe('DataElementComponent', () => {
  let component: DataElementComponent;
  let fixture: ComponentFixture<DataElementComponent>;

  const components = [ ComputedElementComponent, HintDiagramComponent,
    ImageMapComponent,  ExpresssionBlockComponent,DataElementComponent,
    ValueBlockComponent, ExpressionResultComponent, ReportTextComponent];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ components ],
      imports: [
        CommonModule,
        FormsModule
      ],
      providers : [StringUtilityService]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
