import { Component, Input, ViewChild } from '@angular/core';
import { BaseDataElement } from 'testruleengine/Library/Models/Class';
import { UtilityService } from '../../../core/services/utility.service';
import { ModalDirective } from 'ngx-bootstrap';

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
    private utilityService: UtilityService
  ) {
  }

  openDiagram() {
    this.activeSlideIndex = 0;
    this.modalPopup.show();
  }

  getImageDataUrl(label: string): string {
    if (this.utilityService.isNotEmptyString(label)) {
      if (this.utilityService.isImageDataUrl(label)) {
        return label;
      } else if (this.utilityService.isValidInstance(this.assetsBaseUrl)) {
        return `${this.assetsBaseUrl}/${label}`;
      }
    }
  }
}
