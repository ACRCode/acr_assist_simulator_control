import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistDataElementComponent } from './assist-data-element.component';
import { AssistChoiceElementComponent } from './assist-choice-element/assist-choice-element.component';
import { AssistMultiChoiceElementComponent } from './assist-multi-choice-element/assist-multi-choice-element.component';
import { AssistNumericElementComponent } from './assist-numeric-element/assist-numeric-element.component';
import { AssistReportTextComponent } from '../assist-report-text/assist-report-text.component';
import { HintDiagramComponent } from './hint-diagram/hint-diagram.component';
import { ImageMapComponent } from './image-map/image-map.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { DiagramService } from '../shared/services/diagram.service';
import { ArrayCheckerService } from '../shared/services/array-checker.service';
import { ChoiceDataElementCreationService } from '../shared/services/choice-data-element-creation.service';
import { MultipleChoiceDataElementCreationService } from '../shared/services/multiple-choice-data-element-creation.service';
import { CreationServiceInjectorToken } from '../constants';
import { ComputedValueCreationService } from '../shared/services/computed-value-creation.service';
import { ConditionsCreationService } from '../shared/services/conditions-creation.service';
import { DecisionPointsCreationService } from '../shared/services/decision-points-creation.service';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { GlobalValueCreationService } from '../shared/services/global-value-creation.service';
import { IntegerDataElementCreationService } from '../shared/services/integer-data-element-creation.service';
import { NumericDataElementCreationService } from '../shared/services/numeric-data-element-creation.service';
import { ComputedDataElementCreationService } from '../shared/services/computed-data-element-creation.service';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';

describe('AssistDataElementComponent', () => {
  let component: AssistDataElementComponent;
  let fixture: ComponentFixture<AssistDataElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistDataElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent,
                      AssistNumericElementComponent, AssistReportTextComponent, HintDiagramComponent, ImageMapComponent,
                      SlideComponent, CarouselComponent ],
      providers: [TemplateManagerService,
        DiagramService,
        CarouselConfig,
        ArrayCheckerService,
        ConditionsCreationService,
        DecisionPointsCreationService,
        ComputedValueCreationService,
        SimulatorEngineService,
       {provide: CreationServiceInjectorToken, useClass: ChoiceDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: MultipleChoiceDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: NumericDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: IntegerDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: GlobalValueCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: ComputedDataElementCreationService, multi: true }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistDataElementComponent);
    component = fixture.componentInstance;
    component.dataElements = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
