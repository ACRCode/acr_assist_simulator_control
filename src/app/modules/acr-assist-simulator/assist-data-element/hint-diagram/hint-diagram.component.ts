import { Component, HostListener, Input, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BaseDataElement } from 'testruleengine/Library/Models/Class';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'acr-hint-diagram',
  templateUrl: './hint-diagram.component.html',
  styleUrls: ['./hint-diagram.component.css', '../../styles.css']
})
export class HintDiagramComponent {

  activeSlideIndex = 0;

  @Input() dataElement: BaseDataElement;
  @Input() assetsBaseUrl: string;

  @ViewChild('modalPopup', { static: false }) modalPopup: ModalDirective;

  constructor(
    private utilityService: UtilityService,
    private sanitizer : DomSanitizer
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

  getImageDataUrl(label: string): SafeUrl {
    if (this.utilityService.isNotEmptyString(label)) {
      if (this.utilityService.isImageDataUrl(label)) {
        return this.getSanitizedUrl(label);
      } else if (this.utilityService.isValidInstance(this.assetsBaseUrl)) {
        var url = `${this.assetsBaseUrl}/${label}`;
        return this.getSanitizedUrl(url);
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

  getSanitizedUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
