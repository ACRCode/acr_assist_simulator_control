import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AcrAssistSimulatorModule } from './modules/acr-assist-simulator/acr-assist-simulator.module';
import { SimulatorLoaderModule } from './modules/simulatorloader/simulatorloader.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsConfig } from './modules/core/services/settings.service';

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
  bootstrap: [AppComponent]
})
export class AppModule { }
