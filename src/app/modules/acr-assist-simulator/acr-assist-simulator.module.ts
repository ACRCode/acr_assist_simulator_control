import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CoreModule} from '../core/core.module';
import { AcrAssistSimulatorComponent } from './acr-assist-simulator/acr-assist-simulator.component';
import { TemplateManagerService } from './shared/services/template-manager.service';


const components = [AcrAssistSimulatorComponent];
const services =  [TemplateManagerService];


@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: components,
  providers: services,
  exports: components
})
export class AcrAssistSimulatorModule { }
