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
import { GlobalValueCreationService } from './shared/services/global-value-creation.service';
import { ArrayCheckerService } from './shared/services/array-checker.service';
import { ConditionsCreationService } from './shared/services/conditions-creation.service';
import { DecisionPointsCreationService } from './shared/services/decision-points-creation.service';
import { ComputedValueCreationService } from './shared/services/computed-value-creation.service';
import { ComputedElementCreationService } from './shared/services/computed-element-creation.service';


const components = [AcrAssistSimulatorComponent];

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: components,
  providers: [TemplateManagerService,
     DiagramService,
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
