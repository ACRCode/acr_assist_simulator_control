import { Component } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/share/models/file-details.model';

@Component({
  selector: 'acr-app-root',
  template: `

    <div class="container-fluid">
      <div class="row">
          <div class="col-sm-6 col-centered">
             <acr-file-upload-loader (onFileContentRead) ="onFileContentRead($event)"></acr-file-upload-loader>
          </div>
      </div>
       <div >
          <div class="col-sm-12 text-center" *ngIf="fileContent != '' &&  imagePath !=''">
              <acr-assist-simulator templateContent={{fileContent}} imagePath={{imagePath}}></acr-assist-simulator>
           </div>
       </div>
    </div>
  `,
  styles: [`

  `]
})
export class AppComponent {

 fileContent: string;
 imagePath: string;

 constructor () {
    this.fileContent = '';
    this.imagePath = '';
 }

 onFileContentRead(fileDetails: FileDetails) {
      this.fileContent = fileDetails.fileContents;
      const extensionStartPosition = fileDetails.fileName.lastIndexOf('.') ;
      if (extensionStartPosition >= 0) {
        this.imagePath = 'assets/XMLFiles/Samples/' + fileDetails.fileName.substring(0, extensionStartPosition);
      }
 }
}
