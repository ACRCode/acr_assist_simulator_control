import { Component, OnInit, Input } from '@angular/core';
import { ImageElements } from '../../../core/elements/models/image-elements.model';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';

@Component({
  selector: 'acr-assist-choice-element',
  templateUrl: './assist-choice-element.component.html',
  styleUrls: ['./assist-choice-element.component.css', '../../../../modules/styles.css']
})
export class AssistChoiceElementComponent implements OnInit {
  @Input() choiceDataElement: ChoiceDataElement;
  @Input() imagePath: string;
  @Input() keyDiagrams: ImageElements[];

  constructor() { }

  ngOnInit() {
    for (let index = 0; index < this.keyDiagrams.length; index++) {
      this.keyDiagrams[index].location =  this.imagePath + '/' + this.keyDiagrams[index].location;
    }
  }
}
