import { NgModule , ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulatorEngineService } from './services/simulator-engine.service';
import { UtilityService } from './services/utility.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [ SimulatorEngineService, UtilityService ]
    };
  }
 }
