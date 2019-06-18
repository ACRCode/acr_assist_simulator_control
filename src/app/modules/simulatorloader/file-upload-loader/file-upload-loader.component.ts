import { Component, Output , EventEmitter, OnInit } from '@angular/core';
import { FileDetails } from '../shared/models/file-details.model';
import { GlobalsService } from '../shared/services/globals.service';
const $ = require('jquery');

@Component({
  selector: 'acr-file-upload-loader',
  templateUrl: './file-upload-loader.component.html',
  styleUrls: ['./file-upload-loader.component.css']
})

export class FileUploadLoaderComponent implements OnInit  {

  @Output() fileContentRead: EventEmitter<FileDetails> = new EventEmitter<FileDetails>();
  fileReader: FileReader = new FileReader();
  readFile: File;

  constructor (private configService: GlobalsService) {
  }

  ngOnInit(): void {
    this.hideMessage();
    this.showTestModule();
    this.showDefaultModule();
    this.showTestLiradsModule();
  }

  changeListener($event): void {
    let fileName: string;
    fileName = $event.target.value;
    if (fileName.includes('.xml') || fileName.includes('.Xml') || fileName.includes('.XML') ||
    fileName.includes('.zip') || fileName.includes('.Zip') || fileName.includes('.ZIP')) {
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
      self.fileContentRead.emit( new FileDetails(self.readFile.name.substring(0, extensionStartPosition), self.readFile.name, this.fileReader.result.toString()));
    };

    this.fileReader.readAsText(this.readFile);
  }

  showDefaultModule() {
    this.configService.getDefaultModulePath()
      .subscribe(data => {
        const self = this;
        self.fileContentRead.emit( new FileDetails('Hello Assist 2.0', 'Hello_Assist.xml', data));
      });
  }

  showTestModule() {
    this.configService.getDefaultTestModulePath()
    .subscribe(data => {
      const self = this;
      self.fileContentRead.emit( new FileDetails('Test Module', 'Test_Module.xml', data));
    });
  }

  showTestLiradsModule() {
    this.configService.getDefaultLiradsModulePath()
    .subscribe(data => {
      const self = this;
      self.fileContentRead.emit( new FileDetails('LI-RADS', 'ACR LI-RADS.xml', data));
    });
  }
}
