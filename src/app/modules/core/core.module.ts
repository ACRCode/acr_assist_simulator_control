import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { SimulatorEngineService } from './services/simulator-engine.service';
import { UtilityService } from './services/utility.service';

const modules = [CommonModule, ToastrModule.forRoot()];
const services = [SimulatorEngineService, UtilityService];

@NgModule({
  imports: modules,
  declarations: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: services
    };
  }
}
