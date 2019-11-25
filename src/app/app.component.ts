import { Component } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';
import { InputData } from './modules/core/models/input-data.model';
import { ReportTextPosition } from './modules/core/models/report-text.model';
import { ResetCommunicationService } from './modules/acr-assist-simulator/shared/services/reset-communication.service';
import { SettingsService } from './modules/core/services/settings.service';
import { AIInputData } from './modules/core/models/ai-input-data.model';

@Component({
  selector: 'acr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  settingsConfig: SettingsService;
  fileContent: string;
  assetsBaseUrl = '';
  inputValues: InputData[] = [];
  aiInputs: AIInputData[] = [];
  position = ReportTextPosition;
  resetButton: boolean;
  showReportText: boolean;
  testInputValue: InputData[] = [
    {
      dataElementId: 'ObservationCharacter',
      dataElementValue: 'treatedObservation',
      dataElementLabel: '',
      dataElementDisplayValue: ''
    }
  ];
  testAIInputs: AIInputData[] = [
    {
      id: 'diameter_1',
      value: '5'
    }
  ];

  constructor(
    private resetCommunicationService: ResetCommunicationService,
    settingsConfiguration: SettingsService) {
    this.fileContent = '';
    this.resetButton = true;
    this.showReportText = true;
    this.settingsConfig = settingsConfiguration;
  }

  fileSelected(fileDetails: FileDetails) {
    this.fileContent = fileDetails.fileContents;
  }

  setAIInputs() {
    this.aiInputs = this.testAIInputs.map(input => Object.assign({}, input));
    this.inputValues = this.testInputValue;
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
    this.aiInputs = [];
    this.resetCommunicationService.messageEmitter('');
  }

  recievedDataElementChanged(data) {
  }
}
