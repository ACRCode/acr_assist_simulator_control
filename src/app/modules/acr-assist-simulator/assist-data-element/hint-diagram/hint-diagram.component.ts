import { Component, Input } from '@angular/core';
import { BaseDataElement } from 'testruleengine/Library/Models/Class';

@Component({
  selector: 'acr-hint-diagram',
  templateUrl: './hint-diagram.component.html',
  styleUrls: ['./hint-diagram.component.css', '../../styles.css']
})
export class HintDiagramComponent {

  @Input() dataElement: BaseDataElement;
  activeSlideIndex = 0;

  constructor() {
  }

  resetCarouselIndex() {
    this.activeSlideIndex = 0;
  }
}
