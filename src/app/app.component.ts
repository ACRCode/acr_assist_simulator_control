import { Component } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/share/models/file-details.model';

@Component({
  selector: 'acr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
