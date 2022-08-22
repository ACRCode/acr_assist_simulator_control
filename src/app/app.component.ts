import { Component, OnInit } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';
import { MainReportText } from 'testruleengine/Library/Models/Class';
import { InputData } from './modules/core/models/input-data.model';
import { ReportTextPosition } from './modules/core/models/report-text.model';
import { ResetCommunicationService } from './modules/acr-assist-simulator/shared/services/reset-communication.service';
import { SettingsService } from './modules/core/services/settings.service';
import { AIInputData } from './modules/core/models/ai-input-data.model';
import { ChoiceControlStyle } from './modules/core/models/choice-control-style.model';
import { ChoiceElementDisplayEnum } from './modules/core/models/choice-element-display.enum';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'acr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private router : Router) {  }

  ngOnInit(): void {
    //this.router.navigate(["home"]);
  }
}
