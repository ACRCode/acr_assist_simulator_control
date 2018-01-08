import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataElement } from '../../simulator/shared/models/data-element.model';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import {Template} from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';

@Component({
  selector: 'acr-assist-data-element',
  templateUrl: './assist-data-element.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AssistDataElementComponent implements OnInit, OnChanges {
  @Input() dataElements: BaseDataElement[];
  @Input() imagePath: string;
  @Input() keyDiagrams: ImageElements[];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.dataElements);
    this.dataElements = this.dataElements.sort(function (DE_1, DE_2) { return DE_1.displaySequence - DE_2.displaySequence; });
    console.log(this.dataElements);
  }
  constructor() { }

  ngOnInit() {
  }

}
