import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AcrAssistSimulatorModule } from './modules/acr-assist-simulator/acr-assist-simulator.module';
import { SimulatorLoaderModule } from './modules/simulatorloader/simulatorloader.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsConfig } from '../assets/config/settings';

export function initializeApp(appConfig: SettingsConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AcrAssistSimulatorModule,
    CommonModule,
    FormsModule,
    HttpModule,
    SimulatorLoaderModule
  ],
  providers: [
    SettingsConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [SettingsConfig], multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
