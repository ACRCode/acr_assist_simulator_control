import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AcrAssistSimulatorModule } from './modules/acr-assist-simulator/acr-assist-simulator.module';
import { SimulatorLoaderModule } from './modules/simulatorloader/simulatorloader.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsService } from './modules/core/services/settings.service';
import { HttpClientModule } from '@angular/common/http';
// import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AcrAssistSimulatorModule,
    // MatTooltipModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    SimulatorLoaderModule
  ],
  providers: [
    SettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [SettingsService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initializeApp(appConfig: SettingsService) {
  return () => appConfig.loadConfiguration();
}
