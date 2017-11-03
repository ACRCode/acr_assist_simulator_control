import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistSimulatorComponent } from './assist-simulator/assist-simulator.component';
import { ComputedElementComponent } from './computed-element/computed-element.component';
import { HintDiagramComponent } from './hint-diagram/hint-diagram.component';
import { ImageMapComponent } from './image-map/image-map.component';
import { DataElementComponent } from './data-element/data-element.component';
import { ExpresssionBlockComponent } from './expresssion-block/expresssion-block.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AssistSimulatorComponent, ComputedElementComponent, HintDiagramComponent,
    ImageMapComponent, DataElementComponent, ExpresssionBlockComponent],
  exports: [AssistSimulatorComponent, ComputedElementComponent, HintDiagramComponent,
     ImageMapComponent, DataElementComponent, ExpresssionBlockComponent]
})
export class SimulatorModule { }
