import { Component, Input } from '@angular/core';
import { BaseDataElement } from 'testruleengine/Library/Models/Class';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'acr-hint-diagram',
  templateUrl: './hint-diagram.component.html',
  styleUrls: ['./hint-diagram.component.css', '../../styles.css']
})
export class HintDiagramComponent {

  @Input() dataElement: BaseDataElement;
  @Input() assetsBaseUrl: string;
  activeSlideIndex = 0;

  constructor(
    private utilityService: UtilityService
  ) {
  }

  resetCarouselIndex() {
    this.activeSlideIndex = 0;
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
