import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'acr-version-display',
  templateUrl: './version-display.component.html',
  styleUrls: ['./version-display.component.css']
})
export class VersionDisplayComponent  {

   public appVersion;

    constructor() {
      this.appVersion = '1.0.7';
    }
}
