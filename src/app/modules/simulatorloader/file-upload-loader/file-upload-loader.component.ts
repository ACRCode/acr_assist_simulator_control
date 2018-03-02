import { Component, Output , EventEmitter, OnInit } from '@angular/core';
import { FileDetails } from '../shared/models/file-details.model';
const $ = require('jquery');

@Component({
  selector: 'acr-file-upload-loader',
  templateUrl: './file-upload-loader.component.html',
  styleUrls: ['../../styles.css']
})

export class FileUploadLoaderComponent implements OnInit  {
  @Output() onFileContentRead: EventEmitter<FileDetails> = new EventEmitter<FileDetails>();
  fileReader: FileReader = new FileReader();
  readFile: File;

  ngOnInit(): void {
    this.hideMessage();
  }

  changeListener($event): void {
    let fileName: string;
    let folderName: string;
    fileName = $event.target.value;
folderName = $event.target.value;
    if (fileName.includes('.xml') || fileName.includes('.Xml') || fileName.includes('.XML')) {
      this.hideMessage();
    this.readThis($event.target);
    } else {
      if (fileName !== '' && fileName !== undefined) {
        $('#xmlOnlyMsg').show();
      }
    }
  }

  hideMessage() {
    $('#xmlOnlyMsg').hide();
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
