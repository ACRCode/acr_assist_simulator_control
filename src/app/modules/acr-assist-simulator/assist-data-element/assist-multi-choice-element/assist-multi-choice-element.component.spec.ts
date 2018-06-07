import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistMultiChoiceElementComponent } from './assist-multi-choice-element.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HintDiagramComponent } from '../hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../image-map/image-map.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { MultiChoiceDataElement } from '../../../core/elements/models/multi-choice-data-element';

describe('AssistMultiChoiceElementComponent', () => {
  let component: AssistMultiChoiceElementComponent;
  let fixture: ComponentFixture<AssistMultiChoiceElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistMultiChoiceElementComponent, HintDiagramComponent, ImageMapComponent, SlideComponent, CarouselComponent ],
      providers: [CarouselConfig, SimulatorEngineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistMultiChoiceElementComponent);
    component = fixture.componentInstance;
    component.multiChoiceElement = new MultiChoiceDataElement();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
