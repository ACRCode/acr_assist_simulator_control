import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, OnInit,
         ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FinalExecutedHistory } from '../assist-data-element/assist-data-element.component';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { InputData } from '../../core/models/input-data.model';
import { ReportTextPosition } from '../../core/models/report-text.model';
import { ChoiceDataElement, MultiChoiceDataElement, NumericDataElement, IntegerDataElement, DateTimeDataElement,
         BaseDataElement, Template, Diagram, MainReportText } from 'testruleengine/Library/Models/Class';

import { Subject } from 'rxjs';
import { UtilityService } from '../../core/services/utility.service';
import { ChoiceElementDisplayEnum } from '../../core/models/choice-element-display.enum';
import { getTemplate } from 'testruleengine/Library/Utilities/TemplateManager';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FHIRSchema } from '../../core/models/fhir/fhir-schema.model';
import { FHIRElement } from '../../core/models/fhir/fhir-element.model';
import { FHIRReport } from '../../core/models/fhir/fhir-report.model';

const $ = require('jquery');

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css', '../styles.css']
})
export class AcrAssistSimulatorComponent implements OnChanges, OnInit, AfterViewChecked {
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() resetValuesNotifier: Subject<any>;
  @Input() templateContent: string;
  @Input() imagePath: string;
  @Input() showKeyDiagram: boolean;
  @Input() reportTextPosition: ReportTextPosition;
  @Input() inputValues: InputData[] = [];
  @Input() inputData: string;
  @Input() showResetButton = true;
  @Input() showReportText = true;
  @Input() fontSize: string;
  @Input() fontFamily: string;
  @Input() fontColor: string;
  @Input() backgroundColor: string;
  @Input() cssClass: string;
  @Input() choiceElementDisplay: ChoiceElementDisplayEnum;
  @Output() returnExecutionHistory: EventEmitter<any> = new EventEmitter<any>();
  @Output() returnDataElementChanged: EventEmitter<InputData[]> = new EventEmitter<InputData[]>();
  @Output() returnDefaultElements = new EventEmitter();
  @Output() callBackAfterGettingShowKeyDiagram: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('imageUpload', { static: false }) imageUpload: any;
  @ViewChild('simulatorBlock', { read: ElementRef, static: false }) private simulatorBlock: ElementRef;

  template: Template;
  isEmptyContent: boolean;
  keyDiagrams: Diagram[] = [];
  resultText: MainReportText;
  isReset: boolean;
  dataElements: BaseDataElement[];
  position = ReportTextPosition;
  isInvalidFile: boolean;
  moduleName: string;
  acceptedFileTypes = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg'];

  constructor(
    private simulatorEngineService: SimulatorEngineService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrManager,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    if (this.resetValuesNotifier != null) {
      this.resetValuesNotifier.subscribe((event) => {
        this.resetElements();
      });
    }
  }

  ngOnChanges(): void {
    this.isReset = true;
    this.isEmptyContent = this.templateContent === undefined || this.templateContent.length === 0 && this.inputValues.length === 0 &&
      this.inputData === undefined;
    if (this.isEmptyContent) {
      return;
    }
    if (this.inputData !== undefined) {
      if (this.inputData.length > 0) {
        this.inputValues = JSON.parse(this.inputData);
      }
    }
    if (this.imageUpload !== undefined) {
      this.imageUpload.nativeElement.value = '';
    }

    this.template = getTemplate(this.templateContent);
    if (this.inputValues.length !== 0) {
      this.populateTestCaseData();
    }
    this.simulatorEngineService.initialize(this.template);
    this.dataElements = this.template.dataElements;
    this.resultText = undefined;

    if (this.moduleName !== this.template.metadata.id) {
      this.keyDiagrams = new Array<Diagram>();
    }

    if (this.imagePath === undefined || this.imagePath === null || this.imagePath === '') {
      this.imagePath = 'XMLFiles/Samples/';
    }

    if (!this.keyDiagrams.length) {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < this.template.metadata.diagrams.length; index++) {
        if (this.imagePath !== undefined && this.imagePath != null && this.imagePath !== '') {
          const element = new Diagram();
          element.label = this.template.metadata.diagrams[index].label;
          element.location = this.imagePath + '/' + this.template.metadata.diagrams[index].location;
          element.keyDiagram = this.template.metadata.diagrams[index].keyDiagram;
          this.keyDiagrams.push(element);
        }
      }
    }

    const _this = this;
    setTimeout(function(e) {
      _this.applyInputStyles();
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  applyInputStyles() {
    if (this.utilityService.isNotEmptyString(this.fontSize)) {
      this.simulatorBlock.nativeElement.style.fontSize = this.fontSize;
    }

    if (this.utilityService.isNotEmptyString(this.fontColor)) {
      this.simulatorBlock.nativeElement.style.color = this.fontColor;
    }

    if (this.utilityService.isNotEmptyString(this.fontFamily)) {
      this.simulatorBlock.nativeElement.style.fontFamily = this.fontFamily;
    }

    if (this.utilityService.isNotEmptyString(this.backgroundColor)) {
      this.simulatorBlock.nativeElement.style.backgroundColor = this.backgroundColor;
    }

    if (this.utilityService.isNotEmptyString(this.cssClass)) {
      this.simulatorBlock.nativeElement.className = this.simulatorBlock.nativeElement.className + ' ' + this.cssClass + ' ';
    }
  }

  diagramExist(diagram: Diagram) {
    return this.keyDiagrams.some(function(el) {
      return el.location === diagram.location;
    });
  }

  resetElements() {
    this.moduleName = this.template.metadata.id;
    this.template = getTemplate(this.templateContent);
    this.simulatorEngineService.initialize(this.template);
    this.dataElements = Object.assign({}, this.template.dataElements);
    this.resultText = undefined;
    this.returnDefaultElements.emit();
  }

  recieveReportText(textReport: MainReportText) {
    this.resultText = textReport;
  }

  recievedExecutionHistory(finalExecutionHistory: FinalExecutedHistory) {
    const fhirData = this.getFHIRData(finalExecutionHistory);
    this.returnExecutionHistory.emit({finalExecutionHistory, fhirData});
  }

  recivedOnDataElementChanged(data: InputData[]) {
    this.returnDataElementChanged.emit(data);
  }

  GettingShowKeyDiagram(data: string) {
    this.callBackAfterGettingShowKeyDiagram.emit(data);
  }

  changeListener(event): void {
    this.isInvalidFile = false;
    this.keyDiagrams = new Array<Diagram>();
    for (let i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      const diagram = new Diagram();
      diagram.label = event.target.files[i].name;
      diagram.keyDiagram = i === 0 ? true : false;

      if (!(this.acceptedFileTypes.indexOf(event.target.files[i].type) > -1)) {
        this.isInvalidFile = true;
      }

      reader.onload = (event1: any) => {
        diagram.location = reader.result.toString();
      };

      reader.readAsDataURL(event.target.files[i]);

      reader.onloadend = (event1: any) => {
        this.keyDiagrams.push(diagram);
      };
    }

    if ($('#icon_keydiagram').hasClass('fa fa-plus')) {
      this.collapseKeyDiagram();
    }
  }

  resizeKeyImages() {
    const windowHeight = window.innerHeight;
    const reportTextHeight = $('#div-right-reportText').height();
    const height = windowHeight - reportTextHeight - 150;
    $('#carousel-example-generic').height(height + 'px');
  }

  collapseKeyDiagram() {
    if ($('#icon_keydiagram').hasClass('fa fa-minus')) {
      $('#icon_keydiagram').removeClass('fa fa-minus');
      $('#icon_keydiagram').addClass('fa fa-plus');
      $('#body_keydiagram').css({
        display: 'none'
      });
    } else {
      $('#icon_keydiagram').removeClass('fa fa-plus');
      $('#icon_keydiagram').addClass('fa fa-minus');
      $('#body_keydiagram').removeAttr('style');
    }
  }

  collapseReportText() {
    if ($('#icon_reporttext').hasClass('fa fa-minus')) {
      $('#icon_reporttext').removeClass('fa fa-minus');
      $('#icon_reporttext').addClass('fa fa-plus');
      $('#body_reporttext').css({
        display: 'none'
      });
    } else {
      $('#icon_reporttext').removeClass('fa fa-plus');
      $('#icon_reporttext').addClass('fa fa-minus');
      $('#body_reporttext').removeAttr('style');
    }
  }

  populateTestCaseData() {
    this.template.dataElements.forEach(dataeElement => {
      const inputValue = this.inputValues.filter(x => x.dataElementId.toUpperCase() === dataeElement.id.toUpperCase());
      if (inputValue !== undefined && inputValue.length > 0) {
        if (dataeElement.dataElementType === 'ChoiceDataElement' || dataeElement.dataElementType === 'MultiChoiceDataElement') {
          const choiceElement = dataeElement as ChoiceDataElement;
          if (Array.isArray(inputValue[0].dataElementValue)) {
            const values = [];
            choiceElement.choiceInfo.forEach(choice => {
              inputValue[0].dataElementValue.forEach(value => {
                if (choice.value.toUpperCase() === value.toUpperCase()) {
                  values.push(choice.value);
                }
              });
            });
            inputValue[0].dataElementValue = values;
          } else {
            choiceElement.choiceInfo.forEach(choice => {

              if (inputValue[0].dataElementValue !== undefined) {
                if (choice.value.toUpperCase() === inputValue[0].dataElementValue.toUpperCase()) {
                  inputValue[0].dataElementValue = choice.value;
                  return;
                }
              }

            });
          }
        }
        dataeElement.currentValue = inputValue[0].dataElementValue;
      }
    });
  }

  clipboardError(error: Error): void {
    this.toastr.errorToastr('Failed to copy to clipboard');
  }

  clipboardSuccess(value: string): void {
    this.toastr.successToastr('Successfully copied to clipboard');
  }

  private getFHIRData(finalExecutionHistory: FinalExecutedHistory) {
    const fhirData = new FHIRSchema();
    fhirData.module.name = this.template.metadata.label;

    const codableConcept = this.template.metadata.codableConcept;
    if (this.utilityService.isValidInstance(codableConcept) && this.utilityService.isValidInstance(codableConcept.coding)) {
      fhirData.module.code = codableConcept.coding;
    }

    finalExecutionHistory.inputData.filter(x => x.dataElementValue !== undefined).forEach(input => {
      const fhirElem = new FHIRElement();
      fhirElem.id = input.dataElementId;
      fhirElem.value = input.dataElementValue;
      const element = this.template.dataElements.find(x => x.id === input.dataElementId);

      if (element instanceof ChoiceDataElement || element instanceof MultiChoiceDataElement) {
        fhirElem.type = 'string';
      } else if (element instanceof NumericDataElement) {
        fhirElem.type = 'decimal';
      } else if (element instanceof IntegerDataElement) {
        fhirElem.type = 'integer';
      } else if (element instanceof DateTimeDataElement) {
        fhirElem.type = 'datetime';
      }

      if (this.utilityService.isNotEmptyString(element.unit)) {
        fhirElem.unit = element.unit;
      }

      const codingConcept = element.codableConcept;
      if (this.utilityService.isValidInstance(codingConcept) && this.utilityService.isValidInstance(codingConcept.coding)) {
        fhirElem.code = codingConcept.coding;
      }

      fhirData.elements.push(fhirElem);
    });

    finalExecutionHistory.resultText.allReportText.forEach(report => {
      const fhirReport = new FHIRReport();
      fhirReport.id = report.allReportResult.sectionId;
      fhirReport.report = report.allReportResult.reportText;

      fhirData.result.push(fhirReport);
    });

    return fhirData;
  }
}
