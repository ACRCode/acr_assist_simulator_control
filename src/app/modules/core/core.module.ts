import { NgModule , ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulatorEngineService } from './services/simulator-engine.service';
import { UtilityService } from './services/utility.service';
import { ToastrModule } from 'ng6-toastr-notifications';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot()
  ],
  declarations: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [ SimulatorEngineService, UtilityService]
    };
  }
 }
