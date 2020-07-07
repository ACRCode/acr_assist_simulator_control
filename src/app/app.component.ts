import { Component } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';
import { MainReportText } from 'testruleengine/Library/Models/Class';
import { InputData } from './modules/core/models/input-data.model';
import { ReportTextPosition } from './modules/core/models/report-text.model';
import { ResetCommunicationService } from './modules/acr-assist-simulator/shared/services/reset-communication.service';
import { SettingsService } from './modules/core/services/settings.service';
import { AIInputData } from './modules/core/models/ai-input-data.model';
import { SelectBoxOptionStyle } from './modules/core/models/selectbox-option-style.enum';
import { ChoiceControlStyle } from './modules/core/models/choice-control-style.model';

@Component({
  selector: 'acr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  customizeChoiceControlById: ChoiceControlStyle[];
  choiceControlStyle: SelectBoxOptionStyle;
  hideKeyImageUpload: boolean;
  settingsConfig: SettingsService;
  fileContent: string;
  assetsBaseUrl = 'assets/images';
  // assetsBaseUrl = '';
  inputValues: InputData[] = [] as any;
  aiInputs: AIInputData[] = [];
  position = ReportTextPosition;
  resetButton: boolean;
  showReportText: boolean;
  showTabularReportText = false;
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
    // this.choiceControlStyle = SelectBoxOptionStyle.RadioButton;
    // this.customizeChoiceControlById = [{
    //   dataElementId: 'location',
    //   ChoiceElementDisplay: SelectBoxOptionStyle.ListBox
    // },
    // {
    //   dataElementId: 'menopausal_status',
    //   ChoiceElementDisplay: SelectBoxOptionStyle.RadioButton
    // }
    // ];

    // const input = {} as any;
    // input.dataElementId = 'age';
    // input.dataElementValue = '56';
    // input.dataElementLabel = '';
    // input.dataElementDisplayValue = '';
    // this.inputValues.push(input);

    // input.dataElementId = 'views';
    // input.dataElementValue = '0';
    // input.dataElementLabel = '';
    // input.dataElementDisplayValue = '';
    // this.inputValues.push(input);

    // input.dataElementId = 'history';
    // input.dataElementValue = '[0,1]';
    // input.dataElementLabel = '';
    // input.dataElementDisplayValue = '';
    // this.inputValues.push(input);

    // input.dataElementId = 'historic';
    // input.dataElementValue = '1';
    // input.dataElementLabel = '';
    // input.dataElementDisplayValue = '';
    // this.inputValues.push(input);

    // this.inputValues = this.inputValues.slice();
  }

  fileSelected(fileDetails: FileDetails) {
    this.fileContent = fileDetails.fileContents;
    // this.loadElements();
  }

  setAIInputs() {
    this.aiInputs = this.testAIInputs.map(input => Object.assign({}, input));
    this.inputValues = this.testInputValue;
  }

  loadElements() {
    const input = {} as any;
    input.dataElementId = 'age';
    input.dataElementValue = '56';
    input.dataElementLabel = '';
    input.dataElementDisplayValue = '';
    this.inputValues.push({ ...input });

    input.dataElementId = 'views';
    input.dataElementValue = '0';
    input.dataElementLabel = '';
    input.dataElementDisplayValue = '';
    this.inputValues.push({ ...input });

    input.dataElementId = 'history';
    input.dataElementValue = ['0','1'];
    input.dataElementLabel = '';
    input.dataElementDisplayValue = '';
    this.inputValues.push({ ...input });

    input.dataElementId = 'historic';
    input.dataElementValue = '1';
    input.dataElementLabel = '';
    input.dataElementDisplayValue = '';
    this.inputValues.push({ ...input });

    // this.inputValues = this.inputValues.slice();
    // this.inputValues = this.testInputValue;
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

  recieveReportText(textReport: MainReportText) { }

  recievedDataElementChanged(data) { }

  // onresetclick() {
  //   this.inputValues = [];
  // }
}
