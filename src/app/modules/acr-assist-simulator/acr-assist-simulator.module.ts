import { NgModule } from '@angular/core';
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
import { IntegerMaxRestrictDirective } from './shared/directives/integer-restrict-value-greaterthan-max.directive';
import { ClipboardDirective } from './shared/directives/clipboard.directive';
import { ClipboardService } from './shared/services/clipboard.service';
import { SecurePipe } from './shared/pipes/secure.pipe';
import { UrlHelperService } from './shared/services/url-helper.service';

const components = [
  AcrAssistSimulatorComponent, AssistDataElementComponent, HintDiagramComponent,
  AssistNumericElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent,
  ImageMapComponent, AssistReportTextComponent, DynamicHeightDirective, NumericOnlyDirective, SecurePipe,
  IntegerMaxRestrictDirective, ClipboardDirective, AssistDateTimeElementComponent, AssistDurationElementComponent];

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
    ClipboardService,
    UrlHelperService
  ],
  exports: components
})
export class AcrAssistSimulatorModule { }
