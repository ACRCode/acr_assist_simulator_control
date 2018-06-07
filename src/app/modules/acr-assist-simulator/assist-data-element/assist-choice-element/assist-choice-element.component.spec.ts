import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistChoiceElementComponent } from './assist-choice-element.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HintDiagramComponent } from '../hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../image-map/image-map.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';

describe('AssistChoiceElementComponent', () => {
  let component: AssistChoiceElementComponent;
  let fixture: ComponentFixture<AssistChoiceElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistChoiceElementComponent, HintDiagramComponent, ImageMapComponent, CarouselComponent, SlideComponent ],
      providers: [CarouselConfig, SimulatorEngineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistChoiceElementComponent);
    component = fixture.componentInstance;
    component.choiceDataElement = new ChoiceDataElement();
    component.choiceDataElement.choiceInfo = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
