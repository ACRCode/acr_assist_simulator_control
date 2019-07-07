import { Component, Input } from '@angular/core';
import { BaseDataElement } from 'testruleengine/Library/Models/Class';
import { DomSanitizer } from '@angular/platform-browser';

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
  domSanitizer: DomSanitizer;

  constructor(domSanitizer: DomSanitizer) {
    this.domSanitizer = domSanitizer;
  }

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
