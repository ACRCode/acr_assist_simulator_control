import { Component, Output ,  EventEmitter } from '@angular/core';
import { FileDetails } from '../shared/models/file-details.model';


@Component({
  selector: 'acr-file-upload-loader',
  templateUrl: './file-upload-loader.component.html',
  styleUrls: ['../../styles.css']
})
export class FileUploadLoaderComponent  {


  @Output() onFileContentRead: EventEmitter<FileDetails> = new EventEmitter<FileDetails>();
  fileReader: FileReader = new FileReader();
  readFile: File;

  changeListener($event): void {
    this.readThis($event.target);
  }


  readThis(inputValue: any): void {
    this.readFile = inputValue.files[0];
    const self = this;
    const extensionStartPosition = self.readFile.name.lastIndexOf('.');
    this.fileReader.onloadend = (e) => {
      self.onFileContentRead.emit( new FileDetails(self.readFile.name.substring(0, extensionStartPosition),    self.readFile.name, this.fileReader.result));
    };
    this.fileReader.readAsText(this.readFile);
  }
}
