import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {AcrAssistSimulatorModule} from './modules/acr-assist-simulator/acr-assist-simulator.module';
import {SimulatorLoaderModule} from './modules/simulatorloader/simulatorloader.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AcrAssistSimulatorModule,
    CommonModule,
    FormsModule,
    SimulatorLoaderModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
