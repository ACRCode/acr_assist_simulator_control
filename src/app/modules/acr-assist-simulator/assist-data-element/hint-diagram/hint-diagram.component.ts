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

  activeSlideIndex = 0;

  resetCarouselIndex() {
    this.activeSlideIndex = 0;
  }
}
