import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { AcrAssistSimulatorComponent } from './acr-assist-simulator/acr-assist-simulator.component';
import { TemplateManagerService } from './shared/services/template-manager.service';
import { DiagramService} from './shared/services/diagram.service';
import { CreationServiceInjectorToken } from './constants';
import { ChoiceDataElementCreationService } from './shared/services/choice-data-element-creation.service';
import { MultipleChoiceDataElementCreationService } from './shared/services/multiple-choice-data-element-creation.service';
import { NumericDataElementCreationService } from './shared/services/numeric-data-element-creation.service';
import { IntegerDataElementCreationService } from './shared/services/integer-data-element-creation.service';
import { AssistDataElementComponent } from './assist-data-element/assist-data-element.component';
import { HintDiagramComponent } from './assist-data-element/hint-diagram/hint-diagram.component';
import { GlobalValueCreationService } from './shared/services/global-value-creation.service';
import { ArrayCheckerService } from './shared/services/array-checker.service';
import { ConditionsCreationService } from './shared/services/conditions-creation.service';
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

import { DurationDataElementCreationService } from './shared/services/duration-data-element-creation.service';
import { SimulatorCommunicationService } from './shared/services/simulator-communication.service';
import { ResetCommunicationService } from './shared/services/reset-communication.service';
import { EndpointCreationService } from './shared/services/endpoint-creation.service';
import { RuleEngineService } from './shared/services/rule-engine-service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AssistDateTimeElementComponent } from './assist-data-element/assist-date-time-element/assist-date-time-element.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { IntegerMaxRestrict } from './shared/directives/integer-restrict-value-greaterthan-max.directive';
import { SettingsConfig } from '../core/services/settings.service';

const components = [AcrAssistSimulatorComponent, AssistDataElementComponent, HintDiagramComponent,
    AssistNumericElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent,
    ImageMapComponent, AssistReportTextComponent, DynamicHeightDirective, NumericOnlyDirective,
    IntegerMaxRestrict,
    AssistDateTimeElementComponent, AssistDurationElementComponent];
    
    export function initializeApp(appConfig: SettingsConfig) {
      return () => appConfig.load();
    }
    
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    CarouselModule,
    ReactiveFormsModule,
    DragScrollModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: components,
  providers: [TemplateManagerService,
     DiagramService,
     ArrayCheckerService,
     ConditionsCreationService,
     DecisionPointsCreationService,
     ComputedValueCreationService,
     SimulatorEngineService,
     SimulatorCommunicationService,
     ResetCommunicationService,
     EndpointCreationService,
     RuleEngineService,
    { provide: CreationServiceInjectorToken, useClass: ChoiceDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: MultipleChoiceDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: NumericDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: IntegerDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: GlobalValueCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: ComputedDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: DateTimeDataElementCreationService, multi: true },
    { provide: CreationServiceInjectorToken, useClass: DurationDataElementCreationService, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [SettingsConfig],
      multi: true
    }],
  exports: components
})
export class AcrAssistSimulatorModule { }
