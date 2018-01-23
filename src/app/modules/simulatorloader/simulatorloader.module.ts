import { ViewUploadLoaderComponent } from './view-upload-loader/view-upload-loader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadLoaderComponent } from './file-upload-loader/file-upload-loader.component';
import { GlobalsService } from './shared/services/globals.service';

const components = [FileUploadLoaderComponent, ViewUploadLoaderComponent];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [components],
  providers : [GlobalsService],
  exports: [components]
})
export class SimulatorLoaderModule { }
