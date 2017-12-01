import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadLoaderComponent } from './file-upload-loader/file-upload-loader.component';
import { VersionDisplayComponent } from './version-display/version-display.component';


const components = [FileUploadLoaderComponent, VersionDisplayComponent];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [components, VersionDisplayComponent],
  exports: [components]
})
export class SimulatorLoaderModule { }
