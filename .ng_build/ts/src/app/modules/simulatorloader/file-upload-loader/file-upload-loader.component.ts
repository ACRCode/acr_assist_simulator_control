import { Component, Output ,  EventEmitter } from '@angular/core';
import { FileDetails } from '../share/models/file-details.model';

@Component({
  selector: 'acr-file-upload-loader',
  template: `
    <div class = "row">
      <div class= "col-sm-12">
          <div class="panel panel-default">
              <div class="panel-heading">Select  the Template file</div>
              <div class="panel-body">
                  <div class="row">
                        <div class="col-sm-6"> Select the file to be uploaded</div>
                        <div class="col-sm-6"><input type="file" accept=".xml" (change)="changeListener($event)"></div>
                  </div>
              </div>
            </div>
      </div>
    </div>
  `,
  styles: [`

  `]
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
    this.fileReader.onloadend = (e) => {
      self.onFileContentRead.emit( new FileDetails(self.readFile.name, this.fileReader.result));
    };
    this.fileReader.readAsText(this.readFile);
  }
}
