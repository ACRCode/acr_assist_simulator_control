import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { AcrAssistSimulatorComponent } from './acr-assist-simulator/acr-assist-simulator.component';
import { AssistDataElementComponent } from './assist-data-element/assist-data-element.component';
import { HintDiagramComponent } from './assist-data-element/hint-diagram/hint-diagram.component';
import { AssistNumericElementComponent } from './assist-data-element/assist-numeric-element/assist-numeric-element.component';
import { AssistChoiceElementComponent } from './assist-data-element/assist-choice-element/assist-choice-element.component';
import { AssistMultiChoiceElementComponent } from './assist-data-element/assist-multi-choice-element/assist-multi-choice-element.component';
import { ImageMapComponent } from './assist-data-element/image-map/image-map.component';
import { AssistReportTextComponent } from './assist-report-text/assist-report-text.component';
import { SimulatorEngineService } from '../core/services/simulator-engine.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicHeightDirective } from './shared/directives/dynamicheight.directive';
import { NumericOnlyDirective } from './shared/directives/numeric-only.directive';
import { DragScrollModule } from 'ngx-drag-scroll';
import { AssistDurationElementComponent } from './assist-data-element/assist-duration-element/assist-duration-element.component';
import { SimulatorCommunicationService } from './shared/services/simulator-communication.service';
import { ResetCommunicationService } from './shared/services/reset-communication.service';
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
  return appConfig.load();
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
  providers: [
    SimulatorEngineService,
    SimulatorCommunicationService,
    ResetCommunicationService,
    SettingsConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [SettingsConfig],
      multi: true
    }],
  exports: components
})
export class AcrAssistSimulatorModule { }
