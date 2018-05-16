import { Component, ViewEncapsulation } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';
import { InputData } from './modules/core/models/input-data.model';
import { BaseDataElement } from './modules/core/elements/models/base-data-element.model';
import { ReportTextPosition } from './modules/core/models/report-text.model';

@Component({
  selector: 'acr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  fileContent: string;
  imagePath: string;
  inputValues: InputData[] = [];
  position =  ReportTextPosition;
  testInputValue: InputData[] = [
    {
         'dataElementId': 'modality',
         'dataElementValue': 'CT'
       },
       {
         'dataElementId': 'observationnumber',
         'dataElementValue': '1'
       },
       {
         'dataElementId': 'seriesnumber',
         'dataElementValue': '1'
       },
       {
         'dataElementId': 'imagenumber',
         'dataElementValue': '1'
       },
   {
         'dataElementId': 'segmentlocation',
         'dataElementValue': 'II'
       },
   {
         'dataElementId': 'observationinPatient',
         'dataElementValue': 'untreated'
       },
   {
         'dataElementId': 'untreatedobservation',
         'dataElementValue': 'malignantbutnothcc'
       },
   {
         'dataElementId': 'diameter',
         'dataElementValue': '5'
       },
   {
         'dataElementId': 'lrmtargetoidmass',
         'dataElementValue': 'Rim_APHE'
       },
   {
         'dataElementId': 'lrmnontargetoidmass',
         'dataElementValue': 'Infiltrative_appearance'
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
