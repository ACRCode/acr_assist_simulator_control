import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistNumericElementComponent } from './assist-numeric-element.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HintDiagramComponent } from '../hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../image-map/image-map.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';

describe('AssistNumericElementComponent', () => {
  let component: AssistNumericElementComponent;
  let fixture: ComponentFixture<AssistNumericElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistNumericElementComponent, HintDiagramComponent, ImageMapComponent, SlideComponent, CarouselComponent],
      providers: [CarouselConfig, SimulatorEngineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistNumericElementComponent);
    component = fixture.componentInstance;
    component.numericDataElement = new NumericDataElement();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
