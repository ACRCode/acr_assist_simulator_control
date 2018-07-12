import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FileDetails } from '../shared/models/file-details.model';
import { GlobalsService } from '../shared/services/globals.service';
const $ = require('jquery');
@Component({
  selector: 'acr-view-upload-loader',
  templateUrl: './view-upload-loader.component.html',
  styleUrls: ['./view-upload-loader.component.css'],
  preserveWhitespaces: true
})
export class ViewUploadLoaderComponent {

  @Output() onFileSelected: EventEmitter<FileDetails> = new EventEmitter<FileDetails>();

  selectedXML: FileDetails;
  globalsService: GlobalsService;

  constructor(globalsService: GlobalsService) {
    this.globalsService = globalsService;
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

    $('#xmlOnlyMsg').hide();
  }
}
