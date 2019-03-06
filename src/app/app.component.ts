import { Component } from '@angular/core';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';
import { InputData } from './modules/core/models/input-data.model';
import { ReportTextPosition } from './modules/core/models/report-text.model';
import { ResetCommunicationService } from './modules/acr-assist-simulator/shared/services/reset-communication.service';

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
  resetButton: boolean;
  showReportText: boolean;
  testInputValue: InputData[] = [
    {
      'dataElementId': 'othercharacteristics',
      'dataElementValue': 'test',
      'dataElementLabel': '',
      'dataElementDisplayValue': ''
    }
  ];

  constructor(private resetCommunicationService: ResetCommunicationService) {
    this.fileContent = '';
    this.imagePath = '';
    this.resetButton = true;
    this.showReportText = true;
  }

  onFileSelected(fileDetails: FileDetails) {
    this.fileContent = fileDetails.fileContents;
    this.imagePath = 'XMLFiles/Samples/' + fileDetails.fileLabel;
  }

  loadElements() {
    this.inputValues = this.testInputValue;
  }

  showKeyDiagram(data: string) {
    
  }

  recievedExecutionHistory(data){
  }

  returnDefaultElements() {
    this.inputValues = [];
    this.resetCommunicationService.messageEmitter('');
  }
}
