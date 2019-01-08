import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CoreModule} from '../core/core.module';
import { AcrAssistSimulatorComponent } from './acr-assist-simulator/acr-assist-simulator.component';
import {TemplateManagerService } from './shared/services/template-manager.service';
import {DiagramService} from './shared/services/diagram.service';
import {InjectionToken} from '@angular/core';
import { CreationServiceInjectorToken } from './constants';
import {ChoiceDataElementCreationService} from './shared/services/choice-data-element-creation.service';
import {MultipleChoiceDataElementCreationService} from './shared/services/multiple-choice-data-element-creation.service';
import {NumericDataElementCreationService} from './shared/services/numeric-data-element-creation.service';
import {IntegerDataElementCreationService} from './shared/services/integer-data-element-creation.service';
import { AssistDataElementComponent } from './assist-data-element/assist-data-element.component';
import { HintDiagramComponent } from './assist-data-element/hint-diagram/hint-diagram.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { GlobalValueCreationService } from './shared/services/global-value-creation.service';
import { ArrayCheckerService } from './shared/services/array-checker.service';
import { ConditionsCreationService } from './shared/services/conditions-creation.service';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { AssistNumericElementComponent } from './assist-data-element/assist-numeric-element/assist-numeric-element.component';
import { AssistChoiceElementComponent } from './assist-data-element/assist-choice-element/assist-choice-element.component';
import { AssistMultiChoiceElementComponent } from './assist-data-element/assist-multi-choice-element/assist-multi-choice-element.component';
import { ImageMapComponent } from './assist-data-element/image-map/image-map.component';
import { DecisionPointsCreationService } from './shared/services/decision-points-creation.service';
import { ComputedValueCreationService } from './shared/services/computed-value-creation.service';
import { ComputedDataElementCreationService } from './shared/services/computed-data-element-creation.service';
import { AssistReportTextComponent } from './assist-report-text/assist-report-text.component';
import { SimulatorEngineService } from '../core/services/simulator-engine.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicHeightDirective } from './shared/directives/dynamicheight.directive';
import { NumericOnlyDirective } from './shared/directives/numeric-only.directive';
import { DragScrollModule } from 'ngx-drag-scroll';
import { DateTimeDataElementCreationService } from './shared/services/dateTime-data-element-creation.service';
import { AssistDurationElementComponent } from './assist-data-element/assist-duration-element/assist-duration-element.component';

import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { DurationPickerModule } from 'ngx-duration-picker';
import { DurationDataElementCreationService } from './shared/services/duration-data-element-creation.service';
import { SimulatorCommunicationService } from './shared/services/simulator-communication.service';
import { ResetCommunicationService } from './shared/services/reset-communication.service';
import { EndpointCreationService } from './shared/services/endpoint-creation.service';
import { RuleEngineService } from './shared/services/rule-engine-service';
import { RepeatableElementRegisterService } from './shared/services/repeatable-element-register.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AssistDateTimeElementComponent } from './assist-data-element/assist-date-time-element/assist-date-time-element.component';


const components = [AcrAssistSimulatorComponent, AssistDataElementComponent, HintDiagramComponent, SlideComponent, CarouselComponent,
    AssistNumericElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent,
    ImageMapComponent, AssistReportTextComponent, DynamicHeightDirective, NumericOnlyDirective,
    AssistDateTimeElementComponent, AssistDurationElementComponent];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    DragScrollModule,
    AngularDateTimePickerModule,
    // TimeDurationPickerModule
    DurationPickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  declarations: components,
  providers: [TemplateManagerService,
     DiagramService,
     CarouselConfig,
     ArrayCheckerService,
     ConditionsCreationService,
     DecisionPointsCreationService,
     ComputedValueCreationService,
     SimulatorEngineService,
     SimulatorCommunicationService,
     ResetCommunicationService,
     EndpointCreationService,
     RuleEngineService,
     RepeatableElementRegisterService,
    { provide: CreationServiceInjectorToken, useClass: ChoiceDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: MultipleChoiceDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: NumericDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: IntegerDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: GlobalValueCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: ComputedDataElementCreationService, multi: true },
    {provide: CreationServiceInjectorToken, useClass: DateTimeDataElementCreationService, multi: true },
    {provide: CreationServiceInjectorToken, useClass: DurationDataElementCreationService, multi: true }
    ],
  exports: components
})
export class AcrAssistSimulatorModule { }
