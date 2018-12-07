import { Component, Input } from '@angular/core';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';

@Component({
  selector: 'acr-hint-diagram',
  templateUrl: './hint-diagram.component.html',
  styleUrls: ['./hint-diagram.component.css', '../../styles.css']
})
export class HintDiagramComponent {
  @Input() dataElement: BaseDataElement;
  @Input() imagePath: string;
  isDataURL = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
  activeSlideIndex = 0;

  resetCarouselIndex() {
    this.activeSlideIndex = 0;
  }

  getImageDataUrl(location: string): string {
    const isDataURL = !!location.match(this.isDataURL);
    if (isDataURL) {
      location = location.replace('unsafe:', '');
      return location;
    } else {
      return this.imagePath + '/' + location;
    }
  }
}
