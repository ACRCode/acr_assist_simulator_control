import { Component } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';
import { InputData } from './modules/core/models/input-data.model';
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
      'dataElementId': 'othercharacteristics',
      'dataElementValue': 'test',
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
