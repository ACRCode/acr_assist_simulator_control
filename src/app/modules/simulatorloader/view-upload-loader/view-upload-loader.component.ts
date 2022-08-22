import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FileDetails } from '../shared/models/file-details.model';
import { GlobalsService } from '../shared/services/globals.service';
import { ResetCommunicationService } from '../../acr-assist-simulator/shared/services/reset-communication.service';

@Component({
  selector: 'acr-view-upload-loader',
  templateUrl: './view-upload-loader.component.html',
  styleUrls: ['./view-upload-loader.component.css']
})
export class ViewUploadLoaderComponent {

  @Output() fileSelected: EventEmitter<FileDetails> = new EventEmitter<FileDetails>();

  selectedXML: FileDetails;
  globalsService: GlobalsService;

  constructor(
    globalsService: GlobalsService,
    private resetCommunicationService: ResetCommunicationService) {
    this.globalsService = globalsService;
  }

  fileContentRead(fileDetails: FileDetails) {
    this.selectedXML = fileDetails;
    if (this.globalsService.XMLList.ContainsKey(fileDetails.fileLabel)) {
      this.globalsService.XMLList.Remove(fileDetails.fileLabel);
    }
    this.globalsService.XMLList.Add(fileDetails.fileLabel, fileDetails);
    this.fileSelected.emit(fileDetails);
  }

  onFileClick(fileDetails: FileDetails) {
    this.selectedXML = fileDetails;
    this.fileSelected.emit(fileDetails);

    $('#xmlOnlyMsg').hide();

    this.resetCommunicationService.messageEmitter('');
    this.sideMenuClose()
  }

  sideMenuClose() {
    if (window.innerWidth < 768) {
      var width = window.innerWidth;
      if (width <= 320) {
        if ($('body').hasClass('sidebar-open')) {
          $('body').removeClass('sidebar-open');
        } else {
          $('body').addClass('sidebar-open ');
        }
      } else {
        if ($('body').hasClass('sidebar-collapse')) {
          $('body').removeClass('sidebar-collapse');
        } else {
          $('body').addClass('sidebar-collapse ');
        }
      }
    }

  }
}
