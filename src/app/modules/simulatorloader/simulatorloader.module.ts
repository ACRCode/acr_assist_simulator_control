import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewUploadLoaderComponent } from './view-upload-loader/view-upload-loader.component';
import { FileUploadLoaderComponent } from './file-upload-loader/file-upload-loader.component';

import { GlobalsService } from './shared/services/globals.service';

const components = [FileUploadLoaderComponent, ViewUploadLoaderComponent];
const services = [GlobalsService];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: components,
  providers : services,
  exports: components
})
export class SimulatorLoaderModule { }
