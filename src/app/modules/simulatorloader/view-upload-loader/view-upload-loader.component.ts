import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FileDetails } from '../shared/models/file-details.model';
import { GlobalsService } from '../shared/services/globals.service';
@Component({
  selector: 'acr-view-upload-loader',
  templateUrl: './view-upload-loader.component.html',
  styleUrls: ['./view-upload-loader.component.css']
})
export class ViewUploadLoaderComponent implements OnInit {

  @Output() onFileSelected: EventEmitter<FileDetails> = new EventEmitter<FileDetails>();

  selectedXML: FileDetails;
  globalsService: GlobalsService;

  constructor(globalsService: GlobalsService) {
    this.globalsService = globalsService;
  }

  ngOnInit(): void {
    const hellowRadsFileContent = document.getElementById('HellowRadsModule').innerText;
    const helloRadsModule = new FileDetails('Hello_RADS', 'Hello_RADS.xml', hellowRadsFileContent);
    this.globalsService.XMLList.Add(helloRadsModule.fileLabel, helloRadsModule);
    this.selectedXML = helloRadsModule;
    this.onFileSelected.emit(helloRadsModule);
  }

  onFileContentRead(fileDetails: FileDetails) {
    this.selectedXML = fileDetails;
    if (this.globalsService.XMLList.ContainsKey(fileDetails.fileLabel)) {
      this.globalsService.XMLList.Remove(fileDetails.fileLabel);
    }
    this.globalsService.XMLList.Add(fileDetails.fileLabel, fileDetails);
    this.onFileSelected.emit(fileDetails);
  }
  onFileClick(fileDetails: FileDetails) {
    this.selectedXML = fileDetails;
    this.onFileSelected.emit(fileDetails);
  }
}
