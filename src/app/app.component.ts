import { Component, ViewEncapsulation } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';
import { InputData } from './modules/core/models/input-data.model';
import { BaseDataElement } from './modules/core/elements/models/base-data-element.model';
import { ReportTextPosition } from './modules/core/models/report-text.model';

@Component({
  selector: 'acr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  fileContent: string;
  imagePath: string;
  inputValues: InputData[] = [];
  position = ReportTextPosition;
  testInputValue: InputData[] = [
    {
      'dataElementId': 'modality',
      'dataElementValue': 'CT',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'observationnumber',
      'dataElementValue': '1',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'seriesnumber',
      'dataElementValue': '1',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'imagenumber',
      'dataElementValue': '1',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'segmentlocation',
      'dataElementValue': 'II',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'observationinPatient',
      'dataElementValue': 'untreated',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'untreatedobservation',
      'dataElementValue': 'malignantbutnothcc',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'diameter',
      'dataElementValue': '5',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'lrmtargetoidmass',
      'dataElementValue': 'Rim_APHE',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    },
    {
      'dataElementId': 'lrmnontargetoidmass',
      'dataElementValue': 'Infiltrative_appearance',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    }

  ];

  constructor() {
    this.fileContent = '';
    this.imagePath = '';

  }

  onFileSelected(fileDetails: FileDetails) {
    this.fileContent = fileDetails.fileContents;
    this.imagePath = 'XMLFiles/Samples/' + fileDetails.fileLabel;
  }

  loadElements() {
    this.inputValues = this.testInputValue;
  }

  returnDefaultElements() {
    this.inputValues = [];
  }
}
