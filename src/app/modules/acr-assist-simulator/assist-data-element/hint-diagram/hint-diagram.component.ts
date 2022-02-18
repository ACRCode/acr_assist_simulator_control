import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BaseDataElement } from 'testruleengine/Library/Models/Class';
import { UtilityService } from '../../../core/services/utility.service';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'acr-hint-diagram',
  templateUrl: './hint-diagram.component.html',
  styleUrls: ['./hint-diagram.component.css', '../../styles.css']
})
export class HintDiagramComponent {

  activeSlideIndex = 0;

  @Input() dataElement: BaseDataElement;
  @Input() assetsBaseUrl: SafeResourceUrl;

  @ViewChild('modalPopup', { static: false }) modalPopup: ModalDirective;

  constructor(
    private utilityService: UtilityService
  ) { }

  openDiagram() {
    this.activeSlideIndex = 0;
    // this.modalPopup.show();
    const modal = document.getElementById('immgModalhint');
    modal.style.display = 'block';
  }

  isValidImageURL(location: string) {
    return this.utilityService.isValidImageURL(location) || this.utilityService.isImageDataUrl(location);
  }

  getImageDataUrl(label: string): string {
    if (this.utilityService.isNotEmptyString(label)) {
      if (this.utilityService.isImageDataUrl(label)) {
        return label;
      } else if (this.utilityService.isValidInstance(this.assetsBaseUrl)) {
        return `${this.assetsBaseUrl}/${label}`;
      }
    }

    // return 'assets/images/choicediagram5.JPG';
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.onImgPopupClose();
  }

  onImgPopupClose() {
    const modal = document.getElementById('immgModalhint');
    modal.style.display = 'none';
  }
}
