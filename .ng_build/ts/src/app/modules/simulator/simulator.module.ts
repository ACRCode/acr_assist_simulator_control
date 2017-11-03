import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistSimulatorComponent } from './assist-simulator/assist-simulator.component';
import { ComputedElementComponent } from './computed-element/computed-element.component';
import { HintDiagramComponent } from './hint-diagram/hint-diagram.component';
import { ImageMapComponent } from './image-map/image-map.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AssistSimulatorComponent, ComputedElementComponent, HintDiagramComponent, ImageMapComponent],
  exports: [AssistSimulatorComponent, ComputedElementComponent, HintDiagramComponent, ImageMapComponent]
})
export class SimulatorModule { }
