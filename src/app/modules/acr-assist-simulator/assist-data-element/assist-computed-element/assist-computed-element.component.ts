import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'acr-assist-computed-element',
  templateUrl: './assist-computed-element.component.html',
  styleUrls: ['./assist-computed-element.component.css']
})
export class AssistComputedElementComponent implements OnInit {
  @Input() computedDataElement: any;
  constructor() { }

  ngOnInit(): void {
  }

}
