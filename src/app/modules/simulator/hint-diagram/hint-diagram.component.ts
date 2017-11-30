import { Component, OnInit, Input } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-hint-diagram',
  templateUrl: './hint-diagram.component.html',
  styleUrls: ['../../styles.css']
})
export class HintDiagramComponent {
  @Input() DataElement: DataElement;
}
