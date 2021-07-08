import { Component } from '@angular/core';
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

@Component({
  selector: 'acr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  resetValuesNotifier: any;
  customizeChoiceControlById: ChoiceControlStyle[];
  choiceControlStyle: ChoiceElementDisplayEnum;
  hideKeyImageUpload: boolean;
  settingsConfig: SettingsService;
  fileContent: string;
  assetsBaseUrl = 'assets/images';
  // assetsBaseUrl = '';
  inputValues: InputData[] = [] as any;
  // inputValues = [];
  aiInputs: AIInputData[] = [];
  position = ReportTextPosition;
  resetButton: boolean;
  showReportText: boolean;
  showTabularReportText = true;
  isDSIModule = true;
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
    this.choiceControlStyle = ChoiceElementDisplayEnum.SelectBox;
    // this.customizeChoiceControlById = [{
    //   dataElementId: 'location',
    //   ChoiceElementDisplay: ChoiceElementDisplayEnum.ListBox
    // },
    // {
    //   dataElementId: 'menopausal_status',
    //   ChoiceElementDisplay: ChoiceElementDisplayEnum.SelectBox
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

  testcase1() {
    // this.inputValues = [
    //   {
    //     dataElementId: 'location',
    //     dataElementValue: 'right_intraovarian',
    //     dataElementLabel: '',
    //     dataElementDisplayValue: 'Right ovary/adnexa'
    //   },
    //   {
    //     dataElementId: "maximum_size",
    //     dataElementValue: "1",
    //     dataElementLabel: '',
    //     dataElementDisplayValue: "Maximum size"
    //   },
    //   {
    //     dataElementId: "menopausal_status",
    //     dataElementValue: "premenopausal",
    //     dataElementLabel: '',
    //     dataElementDisplayValue: "Premenopausal"
    //   },
    //   {
    //     dataElementId: "intraovarian_lesion_type",
    //     dataElementValue: "cystic",
    //     dataElementLabel: '',
    //     dataElementDisplayValue: "Cystic (must have no internal flow on Doppler)"
    //   },
    //   {
    //     dataElementId: "cystic_lesion",
    //     dataElementValue: "Multilocular",
    //     dataElementLabel: '',
    //     dataElementDisplayValue: "Multilocular"
    //   },
    //   {
    //     dataElementId: "solid_component",
    //     dataElementValue: "no_solid",
    //     dataElementLabel: '',
    //     dataElementDisplayValue: "No solid component"
    //   },
    //   {
    //     dataElementId: "inner_margin",
    //     dataElementValue: "smooth",
    //     dataElementLabel: '',
    //     dataElementDisplayValue: "Smooth"
    //   },
    //   {
    //     dataElementId: "color_score",
    //     dataElementValue: "score_4",
    //     dataElementLabel: '',
    //     dataElementDisplayValue: "4 (Strong flow)"
    //   },
    //   {
    //     dataElementId: "peritoneal_features_ascites",
    //     dataElementValue: [
    //       "ascites"
    //     ],
    //     dataElementLabel: '',
    //     dataElementDisplayValue: "Ascites"
    //   }
    // ];

    // this.resetValuesNotifier = new Subject<boolean>();
    // this.resetValuesNotifier.next(true);
    // this.resetValuesNotifier = true;
    this.inputValues = [
      {
        dataElementId: 'size',
        dataElementValue: '1.4',
        dataElementLabel: '',
        dataElementDisplayValue: '1.4'
      },
      {
        dataElementId: 'patient_age',
        dataElementValue: '65',
        dataElementLabel: '',
        dataElementDisplayValue: '65'
      },
      {
        dataElementId: 'highRiskFeatures',
        dataElementValue: 'muralNodule',
        dataElementLabel: '',
        dataElementDisplayValue: 'mural Nodule'
      },
      {
        dataElementId: 'numberOfCysts',
        dataElementValue: 'single',
        dataElementLabel: '',
        dataElementDisplayValue: 'single'
      },
      {
        dataElementId: 'cystMorphology',
        dataElementValue: 'indeterminate',
        dataElementLabel: '',
        dataElementDisplayValue: 'indeterminate'
      },
      {
        dataElementId: 'cystLocation',
        dataElementValue: 'head',
        dataElementLabel: '',
        dataElementDisplayValue: 'head'
      },
      {
        dataElementId: 'series',
        dataElementValue: '1',
        dataElementLabel: '',
        dataElementDisplayValue: '1'
      },
      {
        dataElementId: 'image',
        dataElementValue: '1',
        dataElementLabel: '',
        dataElementDisplayValue: '1'
      }
    ]

    this.inputValues = this.inputValues.slice()
  }

  testcase2() {

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
    input.dataElementId = 'breast-density-classification';
    input.dataElementValue = '3';
    input.dataElementLabel = '';
    input.dataElementDisplayValue = '';
    this.inputValues.push({ ...input });


    // input.dataElementId = 'observationnumber';
    // input.dataElementValue = '0.5';
    // input.dataElementLabel = '';
    // input.dataElementDisplayValue = '';
    // this.inputValues.push({ ...input });


    // input.dataElementId = 'views';
    // input.dataElementValue = '0';
    // input.dataElementLabel = '';
    // input.dataElementDisplayValue = '';
    // this.inputValues.push({ ...input });

    // input.dataElementId = 'history';
    // input.dataElementValue = ['0', '1'];
    // input.dataElementLabel = '';
    // input.dataElementDisplayValue = '';
    // this.inputValues.push({ ...input });

    // input.dataElementId = 'historic';
    // input.dataElementValue = '1';
    // input.dataElementLabel = '';
    // input.dataElementDisplayValue = '';
    // this.inputValues.push({ ...input });

    this.inputValues = this.inputValues.slice();
    // this.inputValues = this.testInputValue;
  }

  showKeyDiagram(data: string) {
  }

  recievedExecutionHistory(data) {
  }

  returnDefaultElements(event) {
    this.inputValues = [];
    this.aiInputs = [];
    this.resetCommunicationService.messageEmitter('');
  }

  recieveReportText(textReport: MainReportText) { }

  recievedDataElementChanged(data) {
  }

  // onresetclick() {
  //   this.inputValues = [];
  // }
}
