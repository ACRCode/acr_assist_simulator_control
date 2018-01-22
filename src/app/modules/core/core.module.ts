import {NgModule , ModuleWithProviders } from '@angular/core';
import {CommonModule } from '@angular/common';
import {WorkflowEngineService} from './services/workflow-engine.service';

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
      providers: [ WorkflowEngineService]
    };
  }


 }
