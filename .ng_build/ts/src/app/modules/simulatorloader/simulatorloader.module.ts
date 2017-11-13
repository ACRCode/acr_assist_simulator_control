import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadLoaderComponent } from './file-upload-loader/file-upload-loader.component';


const components = [FileUploadLoaderComponent];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [components],
  exports: [components]
})
export class SimulatorLoaderModule { }
