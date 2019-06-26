import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AcrAssistSimulatorModule } from './modules/acr-assist-simulator/acr-assist-simulator.module';
import { SimulatorLoaderModule } from './modules/simulatorloader/simulatorloader.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

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
    HttpClientModule,
    SimulatorLoaderModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
