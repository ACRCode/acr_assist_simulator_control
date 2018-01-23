import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CoreModule} from '../core/core.module';
import { AcrAssistSimulatorComponent } from './acr-assist-simulator/acr-assist-simulator.component';
import { TemplateManagerService } from './shared/services/template-manager.service';
import {DiagramService} from './shared/services/diagram.service';
import {InjectionToken} from '@angular/core';
import { CreationServiceInjectorToken } from './constants';
import {ChoiceDataElementCreationService} from './shared/services/choice-data-element-creation.service';
import {MultipleChoiceDataElementCreationService} from './shared/services/multiple-choice-data-element-creation.service';
import {NumericDataElementCreationService} from './shared/services/numeric-data-element-creation.service';
import {IntegerDataElementCreationService} from './shared/services/integer-data-element-creation.service';
import { AssistDataElementComponent } from './assist-data-element/assist-data-element.component';
import { HintDiagramComponent } from '../simulator/hint-diagram/hint-diagram.component';
import { SlideComponent } from 'ng2-bootstrap/carousel/slide.component';
import { GlobalValueCreationService } from './shared/services/global-value-creation.service';
import { ArrayCheckerService } from './shared/services/array-checker.service';
import { ConditionsCreationService } from './shared/services/conditions-creation.service';
import { CarouselComponent } from 'ng2-bootstrap/carousel/carousel.component';
import { CarouselConfig } from 'ng2-bootstrap/carousel/carousel.config';
import { AssistNumericElementComponent } from './assist-data-element/assist-numeric-element/assist-numeric-element.component';
import { AssistChoiceElementComponent } from './assist-data-element/assist-choice-element/assist-choice-element.component';
import { AssistMultiChoiceElementComponent } from './assist-data-element/assist-multi-choice-element/assist-multi-choice-element.component';
import { ImageMapComponent } from '../simulator/image-map/image-map.component';

import { DecisionPointsCreationService } from './shared/services/decision-points-creation.service';
import { ComputedValueCreationService } from './shared/services/computed-value-creation.service';
import { ComputedElementCreationService } from './shared/services/computed-element-creation.service';
import { AssistReportTextComponent } from './assist-report-text/assist-report-text.component';



const components = [AcrAssistSimulatorComponent, AssistDataElementComponent, HintDiagramComponent, SlideComponent, CarouselComponent,
    AssistNumericElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent, ImageMapComponent, AssistReportTextComponent];

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: components,
  providers: [TemplateManagerService,
     DiagramService,
     CarouselConfig,
     ArrayCheckerService,
     ConditionsCreationService,
     DecisionPointsCreationService,
     ComputedValueCreationService,
    {provide: CreationServiceInjectorToken, useClass: ChoiceDataElementCreationService, multi: true },
    {provide: CreationServiceInjectorToken, useClass: MultipleChoiceDataElementCreationService, multi: true },
    {provide: CreationServiceInjectorToken, useClass: NumericDataElementCreationService, multi: true },
    {provide: CreationServiceInjectorToken, useClass: IntegerDataElementCreationService, multi: true },
    {provide: CreationServiceInjectorToken, useClass: GlobalValueCreationService, multi: true },
    {provide: CreationServiceInjectorToken, useClass: ComputedElementCreationService, multi: true }

    ],
  exports: components
})
export class AcrAssistSimulatorModule { }
