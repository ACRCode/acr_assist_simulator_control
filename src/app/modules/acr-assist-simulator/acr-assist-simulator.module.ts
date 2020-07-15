import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../core/core.module';
import { DragScrollModule } from 'ngx-drag-scroll';
import { NgxLoadingModule } from 'ngx-loading';
import { OwlDateTimeModule, OwlMomentDateTimeModule } from '@busacca/ng-pick-datetime';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AcrAssistSimulatorComponent } from './acr-assist-simulator/acr-assist-simulator.component';
import { AssistDataElementComponent } from './assist-data-element/assist-data-element.component';
import { HintDiagramComponent } from './assist-data-element/hint-diagram/hint-diagram.component';
import { AssistNumericElementComponent } from './assist-data-element/assist-numeric-element/assist-numeric-element.component';
import { AssistChoiceElementComponent } from './assist-data-element/assist-choice-element/assist-choice-element.component';
import { AssistMultiChoiceElementComponent } from './assist-data-element/assist-multi-choice-element/assist-multi-choice-element.component';
import { ImageMapComponent } from './assist-data-element/image-map/image-map.component';
import { AssistReportTextComponent } from './assist-report-text/assist-report-text.component';
import { AssistDurationElementComponent } from './assist-data-element/assist-duration-element/assist-duration-element.component';
import { AssistDateTimeElementComponent } from './assist-data-element/assist-date-time-element/assist-date-time-element.component';

import { ClipboardDirective } from './shared/directives/clipboard.directive';
import { DynamicHeightDirective } from './shared/directives/dynamicheight.directive';
import { NumericOnlyDirective } from './shared/directives/numeric-only.directive';
import { IntegerMaxRestrictDirective } from './shared/directives/integer-restrict-value-greaterthan-max.directive';
import { SecurePipe } from './shared/pipes/secure.pipe';

import { SimulatorEngineService } from '../core/services/simulator-engine.service';
import { SimulatorCommunicationService } from './shared/services/simulator-communication.service';
import { ResetCommunicationService } from './shared/services/reset-communication.service';
import { ClipboardService } from './shared/services/clipboard.service';
import { UrlHelperService } from './shared/services/url-helper.service';
import { AssistComputedElementComponent } from './assist-data-element/assist-computed-element/assist-computed-element.component';

const components = [AcrAssistSimulatorComponent, AssistDataElementComponent, HintDiagramComponent,
  AssistNumericElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent,
  ImageMapComponent, AssistReportTextComponent, DynamicHeightDirective, NumericOnlyDirective, SecurePipe,
  IntegerMaxRestrictDirective, ClipboardDirective, AssistDateTimeElementComponent, AssistDurationElementComponent, AssistComputedElementComponent];

const modules = [CommonModule, CoreModule, FormsModule, CarouselModule.forRoot(), ModalModule.forRoot(), ReactiveFormsModule,
  DragScrollModule, OwlDateTimeModule, OwlMomentDateTimeModule, NgxLoadingModule];

const services = [SimulatorEngineService, SimulatorCommunicationService, ResetCommunicationService, ClipboardService, UrlHelperService];

@NgModule({
  imports: modules,
  declarations: components,
  providers: services,
  exports: components
})
export class AcrAssistSimulatorModule { }
