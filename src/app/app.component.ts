import { Component } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';
import { InputData } from './modules/core/models/input-data.model';
import { ReportTextPosition } from './modules/core/models/report-text.model';
import { ResetCommunicationService } from './modules/acr-assist-simulator/shared/services/reset-communication.service';
import { SettingsService } from './modules/core/services/settings.service';

@Component({
  selector: 'acr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  settingsConfig: SettingsService;
  fileContent: string;
  imagePath: string;
  inputValues: InputData[] = [];
  position = ReportTextPosition;
  resetButton: boolean;
  showReportText: boolean;
  testInputValue: InputData[] = [
    {
      dataElementId: 'ObservationCharacter',
      dataElementValue: 'notDefProbBenign',
      dataElementLabel: '',
      dataElementDisplayValue: ''
    },
    {
      dataElementId: 'ArterialEnhancement',
      dataElementValue: 'hyperEnhancing',
      dataElementLabel: '',
      dataElementDisplayValue: ''
    },
    {
      dataElementId: 'diameter',
      dataElementValue: '10',
      dataElementLabel: '',
      dataElementDisplayValue: ''
    },
    {
      dataElementId: 'washout',
      dataElementValue: 'yes',
      dataElementLabel: '',
      dataElementDisplayValue: ''
    },
    {
      dataElementId: 'capsule',
      dataElementValue: 'yes',
      dataElementLabel: '',
      dataElementDisplayValue: ''
    },
    {
      dataElementId: 'thresholdgrowth',
      dataElementValue: 'no',
      dataElementLabel: '',
      dataElementDisplayValue: ''
    },
    {
      dataElementId: 'consultationDate',
      dataElementValue: '8/28/2019, 2:50 PM',
      dataElementLabel: '',
      dataElementDisplayValue: ''
    }
  ];

  constructor(
    private resetCommunicationService: ResetCommunicationService,
    settingsConfiguration: SettingsService) {
    this.fileContent = '';
    this.imagePath = '';
    this.resetButton = true;
    this.showReportText = true;
    this.settingsConfig = settingsConfiguration;
  }

  fileSelected(fileDetails: FileDetails) {
    this.fileContent = fileDetails.fileContents;
    this.imagePath = 'XMLFiles/Samples/' + fileDetails.fileLabel;
  }

  loadElements() {
    this.inputValues = this.testInputValue;
  }

  showKeyDiagram(data: string) {
  }

  recievedExecutionHistory(data) {
  }

  returnDefaultElements() {
    this.inputValues = [];
    this.resetCommunicationService.messageEmitter('');
  }

  recievedDataElementChanged(data) {
  }
}
