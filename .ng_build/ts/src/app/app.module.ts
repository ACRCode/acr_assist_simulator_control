import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {SimulatorModule} from './modules/simulator/simulator.module';
import {SimulatorLoaderModule} from './modules/simulatorloader/simulatorloader.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SimulatorModule,
    CommonModule,
    FormsModule,
    SimulatorLoaderModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
