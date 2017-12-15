import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'acr-version-display',
  templateUrl: './version-display.component.html',
  styleUrls: ['../../styles.css']
})
export class VersionDisplayComponent  {

   public appVersion;

    constructor() {
      this.appVersion = '1.0.25';


    }
}

