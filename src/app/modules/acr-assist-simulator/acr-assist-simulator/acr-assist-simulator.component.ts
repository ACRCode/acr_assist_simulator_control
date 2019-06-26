import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { Template } from '../../core/models/template.model';
import { MainReportText, FinalExecutedHistory } from '../assist-data-element/assist-data-element.component';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { Diagram } from '../../core/models/diagram.model';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import { InputData } from '../../core/models/input-data.model';
import { ReportTextPosition } from '../../core/models/report-text.model';
import { ChoiceDataElement } from '../../core/elements/models/choice-data-element-model';
import { Subject } from 'rxjs';
import { UtilityService } from '../../core/services/utility.service';
import { ChoiceElementDisplayEnum } from '../../core/models/choice-element-display.enum';

const $ = require('jquery');
declare var resizeKeyImages: any;

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css', '../styles.css']
})
export class AcrAssistSimulatorComponent implements OnChanges {
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() resetValuesNotifier: Subject<any>;
  @Input() templateContent: string;
  @Input() imagePath: string;
  @Input() showKeyDiagram: boolean;
  @Input() reportTextPosition: ReportTextPosition;
  @Input() inputValues: InputData[] = [];
  @Input() inputData: string;
  @Input() showResetButton: Boolean = true;
  @Input() showReportText: Boolean = true;
  @Input() fontSize: string;
  @Input() fontFamily: string;
  @Input() fontColor: string;
  @Input() backgroundColor: string;
  @Input() cssClass: string;
  @Input() choiceElementDisplay: ChoiceElementDisplayEnum;
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();
  @Output() returnDataElementChanged: EventEmitter<InputData[]> = new EventEmitter<InputData[]>();
  @Output() returnDefaultElements = new EventEmitter();
  @Output() callBackAfterGettingShowKeyDiagram: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('imageUpload', { static: false }) imageUpload: any;
  @ViewChild('simulatorBlock', { static: false, read: ElementRef }) private simulatorBlock: ElementRef;

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
    private templateManagerService: TemplateManagerService,
    private simulatorEngineService: SimulatorEngineService,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    if (this.resetValuesNotifier != null) {
      this.resetValuesNotifier.subscribe((event) => {
        this.resetElements();
      })
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

    this.template = this.templateManagerService.getTemplate(this.templateContent);
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
      for (let index = 0; index < this.template.metadata.diagrams.length; index++) {
        if (this.imagePath != undefined && this.imagePath != null && this.imagePath != '') {
          const element = new Diagram();
          element.label = this.template.metadata.diagrams[index].label;
          element.location = this.imagePath + '/' + this.template.metadata.diagrams[index].location;
          element.keyDiagram = this.template.metadata.diagrams[index].keyDiagram;
          this.keyDiagrams.push(element);
        }
      }
    }

    const _this = this;
    setTimeout(function (e) {
      _this.applyInputStyles();
    });
  }

  applyInputStyles() {
    //this.fontSize = '14px';
    if (this.utilityService.isNotEmptyString(this.fontSize)) {
      this.simulatorBlock.nativeElement.style.fontSize = this.fontSize;
    }

    //this.fontColor = 'red';
    if (this.utilityService.isNotEmptyString(this.fontColor)) {
      this.simulatorBlock.nativeElement.style.color = this.fontColor;

    }

    //this.fontFamily = 'cursive';
    if (this.utilityService.isNotEmptyString(this.fontFamily)) {
      this.simulatorBlock.nativeElement.style.fontFamily = this.fontFamily;

    }
    // this.choiceElementDisplay = ChoiceElementDisplayEnum.ListBox;

    //this.backgroundColor = "grey";
    if (this.utilityService.isNotEmptyString(this.backgroundColor)) {
      this.simulatorBlock.nativeElement.style.backgroundColor = this.backgroundColor;

    }

    // this.cssClass = "custom-class";
    if (this.utilityService.isNotEmptyString(this.cssClass)) {
      this.simulatorBlock.nativeElement.className = this.simulatorBlock.nativeElement.className + ' ' + this.cssClass + ' ';

    }

  }

  diagramExist(diagram: Diagram) {
    return this.keyDiagrams.some(function (el) {
      return el.location === diagram.location;
    });
  }

  resetElements() {
    this.moduleName = this.template.metadata.id;
    this.template = this.templateManagerService.getTemplate(this.templateContent);
    this.simulatorEngineService.initialize(this.template);
    this.dataElements = Object.assign({}, this.template.dataElements);
    this.resultText = undefined;
    this.returnDefaultElements.emit();
  }

  recieveReportText(textReport: MainReportText) {
    this.resultText = textReport;
  }

  recievedExecutionHistory(finalExecutionHistory: FinalExecutedHistory) {
    this.returnExecutionHistory.emit(finalExecutionHistory);
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
      this.collapseKeyDiagram()
    }
  }

  resizeKeyImages() {
    resizeKeyImages();
  }

  collapseKeyDiagram() {
    if ($('#icon_keydiagram').hasClass('fa fa-minus')) {
      $('#icon_keydiagram').removeClass('fa fa-minus');
      $('#icon_keydiagram').addClass('fa fa-plus');
      $('#body_keydiagram').css({
        'display': 'none'
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
        'display': 'none'
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
          const choiceElement = <ChoiceDataElement>dataeElement;
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

  VendorImplementationTestOnClick() {
    // alert();
    // const test =  this.base64EncoderDecoderService.Base64.decode('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPD94bWwtbW9kZWwgaHJlZj0iLi4vLi4vWE1MIFNjaGVtYS9BQ1JBc3Npc3RfeG1sX3NjaGVtYS5ybmMiIHR5cGU9ImFwcGxpY2F0aW9uL3JlbGF4LW5nLWNvbXBhY3Qtc3ludGF4Ij8+CjxSZXBvcnRpbmdNb2R1bGU+Cgk8TWV0YWRhdGE+CgkJPExhYmVsPkhlbGxvIEFzc2lzdDwvTGFiZWw+CgkJPElEPkhlbGxvIEFzc2lzdDwvSUQ+CgkJPFNjaGVtYVZlcnNpb24+Mi4wPC9TY2hlbWFWZXJzaW9uPgoJCTxNb2R1bGVWZXJzaW9uPjIuMDwvTW9kdWxlVmVyc2lvbj4KCQk8Q3JlYXRlZERhdGU+MjAxOC0xMi0zMTwvQ3JlYXRlZERhdGU+CgkJPExhc3RNb2RpZmllZERhdGU+MjAxOC0xMS0yNjwvTGFzdE1vZGlmaWVkRGF0ZT4KCQk8QXBwcm92ZWRCeT5BbWVyaWNhbiBDb2xsZWdlIG9mIFJhZGlvbG9neTwvQXBwcm92ZWRCeT4KCQk8UmV2aWV3ZWRCeT5BbWVyaWNhbiBDb2xsZWdlIG9mIFJhZGlvbG9neTwvUmV2aWV3ZWRCeT4KCQk8RGV2ZWxvcGVkQnk+QW1lcmljYW4gQ29sbGVnZSBvZiBSYWRpb2xvZ3k8L0RldmVsb3BlZEJ5PgoJCTxJbmZvPgoJCQk8RGVzY3JpcHRpb24+SGVsbG8gQXNzaXN0IGxldmVsIGRldGVybWluYXRpb248L0Rlc2NyaXB0aW9uPgoJCQk8UmVmZXJlbmNlcz4KCQkJCTxDaXRhdGlvbiBVcmw9Imh0dHBzOi8vbnJkci5hY3Iub3JnL2xpcmFkcy8iPgogICAgICAgICAgICAgICAgQUNSIEhlbGxvIEFzc2lzdDwvQ2l0YXRpb24+CgkJCTwvUmVmZXJlbmNlcz4KCQkJPERpYWdyYW1zPgoJCQkJPERpYWdyYW0gSWQ9IktleURpYWdyYW0iIERpc3BsYXlTZXF1ZW5jZT0iMSIgSXNLZXlEaWFncmFtPSJ0cnVlIj4JCQkJCQoJCQkJCTxMb2NhdGlvbj5LZXlEaWFncmFtLmpwZzwvTG9jYXRpb24+CgkJCQkJPExhYmVsPkhlbGxvIEFzc2lzdDwvTGFiZWw+CgkJCQk8L0RpYWdyYW0+CgkJCQkKCQkJCTxEaWFncmFtIElkPSJLZXlEaWFncmFtQnJhbmNoXzEiIERpc3BsYXlTZXF1ZW5jZT0iMiIgSXNLZXlEaWFncmFtPSJ0cnVlIj4KCQkJCQk8TG9jYXRpb24+S2V5RGlhZ3JhbUJyYW5jaF8xLmdpZjwvTG9jYXRpb24+CgkJCQkJPExhYmVsPkhlbGxvIEFzc2lzdCBCcmFuY2ggMTwvTGFiZWw+CgkJCQk8L0RpYWdyYW0+CgkJCQkKCQkJCTxEaWFncmFtIElkPSJLZXlEaWFncmFtQnJhbmNoXzIiIERpc3BsYXlTZXF1ZW5jZT0iMyIgSXNLZXlEaWFncmFtPSJ0cnVlIj4KCQkJCQk8TG9jYXRpb24+S2V5RGlhZ3JhbUJyYW5jaF8yLmdpZjwvTG9jYXRpb24+CgkJCQkJPExhYmVsPkhlbGxvIEFzc2lzdCBCcmFuY2ggMjwvTGFiZWw+CgkJCQk8L0RpYWdyYW0+CgkJCQkKCQkJCTxEaWFncmFtIElkPSJLZXlEaWFncmFtQnJhbmNoXzMiIERpc3BsYXlTZXF1ZW5jZT0iNCIgSXNLZXlEaWFncmFtPSJ0cnVlIj4KCQkJCQk8TG9jYXRpb24+S2V5RGlhZ3JhbUJyYW5jaF8zLmdpZjwvTG9jYXRpb24+CgkJCQkJPExhYmVsPkhlbGxvIEFzc2lzdCBCcmFuY2ggMzwvTGFiZWw+CgkJCQk8L0RpYWdyYW0+CgkJCTwvRGlhZ3JhbXM+CgkJCTxDb250YWN0PgoJCQkJPE5hbWU+QUNSIEFzc2lzdDwvTmFtZT4KCQkJCTxFbWFpbD5hY3ItYXNzaXN0QGFjci5vcmc8L0VtYWlsPgoJCQkJPEluc3RpdHV0aW9uPkFtZXJpY2FuIENvbGxlZ2Ugb2YgUmFkaW9sb2d5PC9JbnN0aXR1dGlvbj4KCQkJPC9Db250YWN0PgoJCTwvSW5mbz4KCQk8UmVwb3J0Q2l0YXRpb25UZXh0PkhlbGxvIEFzc2lzdDwvUmVwb3J0Q2l0YXRpb25UZXh0PgoJCTxBcHBsaWNhYmxlU2V4ZXMgVmFsdWU9IkJvdGgiPjwvQXBwbGljYWJsZVNleGVzPgoJPC9NZXRhZGF0YT4KCgk8RGF0YUVsZW1lbnRzPgoKCQk8SW50ZWdlckRhdGFFbGVtZW50IElkPSJvYnNlcnZhdGlvbm51bWJlciIgSXNSZXF1aXJlZD0idHJ1ZSIgRGlzcGxheVNlcXVlbmNlPSIxIj4KCQkJPExhYmVsPk9ic2VydmF0aW9uIG51bWJlcjwvTGFiZWw+CgkJCTxNaW5pbXVtPjE8L01pbmltdW0+CgkJPC9JbnRlZ2VyRGF0YUVsZW1lbnQ+CgoJCTxDaG9pY2VEYXRhRWxlbWVudCBJZD0iTG9jYXRpb24iIElzUmVxdWlyZWQ9InRydWUiIERpc3BsYXlTZXF1ZW5jZT0iMiI+CgkJCTxMYWJlbD5Mb2NhdGlvbjwvTGFiZWw+CgkJCTxDaG9pY2VJbmZvPgoJCQkJPENob2ljZT4KCQkJCQk8VmFsdWU+MTwvVmFsdWU+CgkJCQkJPExhYmVsPjEtVXBwZXIgbGVmdCBxdWFkcmFudDwvTGFiZWw+CQoJCQkJPC9DaG9pY2U+CgkJCQk8Q2hvaWNlPgoJCQkJCTxWYWx1ZT4yPC9WYWx1ZT4KCQkJCQk8TGFiZWw+Mi1VcHBlciByaWdodCBxdWFkcmFudDwvTGFiZWw+CgkJCQk8L0Nob2ljZT4KCQkJCTxDaG9pY2U+CgkJCQkJPFZhbHVlPjM8L1ZhbHVlPgoJCQkJCTxMYWJlbD4zLUxvd2VyIGxlZnQgcXVhZHJhbnQ8L0xhYmVsPgoJCQkJPC9DaG9pY2U+CgkJCQk8Q2hvaWNlPgoJCQkJCTxWYWx1ZT40PC9WYWx1ZT4KCQkJCQk8TGFiZWw+NC1Mb3dlciByaWdodCBxdWFkcmFudDwvTGFiZWw+CgkJCQk8L0Nob2ljZT4KCQkJPC9DaG9pY2VJbmZvPgkJCQoJCTwvQ2hvaWNlRGF0YUVsZW1lbnQ+CgoJCTxDaG9pY2VEYXRhRWxlbWVudCBJZD0iU2l6ZSIgSXNSZXF1aXJlZD0idHJ1ZSIgRGlzcGxheVNlcXVlbmNlPSIzIj4KCQkJPExhYmVsPlNpemU8L0xhYmVsPgoJCQk8Q2hvaWNlSW5mbz4KCQkJCTxDaG9pY2U+CgkJCQkJPFZhbHVlPjE8L1ZhbHVlPgoJCQkJCTxMYWJlbD4mbHQ7IDRtbTwvTGFiZWw+CQoJCQkJPC9DaG9pY2U+CgkJCQk8Q2hvaWNlPgoJCQkJCTxWYWx1ZT4yPC9WYWx1ZT4KCQkJCQk8TGFiZWw+IOKJpSA0bW08L0xhYmVsPgoJCQkJPC9DaG9pY2U+CgkJCTwvQ2hvaWNlSW5mbz4JCQkJCQoJCTwvQ2hvaWNlRGF0YUVsZW1lbnQ+CgoJCTxDaG9pY2VEYXRhRWxlbWVudCBJZD0iRW5oYW5jZW1lbnQiIElzUmVxdWlyZWQ9InRydWUiIERpc3BsYXlTZXF1ZW5jZT0iNCI+CgkJCTxMYWJlbD5FbmhhbmNlbWVudCBwcmVzZW50PC9MYWJlbD4KCQkJPENob2ljZUluZm8+CgkJCQk8Q2hvaWNlPgoJCQkJCTxWYWx1ZT5ZPC9WYWx1ZT4KCQkJCQk8TGFiZWw+WWVzPC9MYWJlbD4JCgkJCQk8L0Nob2ljZT4KCQkJCTxDaG9pY2U+CgkJCQkJPFZhbHVlPk48L1ZhbHVlPgoJCQkJCTxMYWJlbD5ObzwvTGFiZWw+CgkJCQk8L0Nob2ljZT4JCQkJCgkJCTwvQ2hvaWNlSW5mbz4KCQkJPENvbmRpdGlvbmFsUHJvcGVydGllcz4KCQkJCTxDb25kaXRpb25hbFByb3BlcnR5PgoJCQkJCTxFcXVhbENvbmRpdGlvbiBDb21wYXJpc29uVmFsdWU9IjEiIERhdGFFbGVtZW50SWQ9IlNpemUiLz4KCQkJCQk8SXNSZWxldmFudD5mYWxzZTwvSXNSZWxldmFudD4KCQkJCTwvQ29uZGl0aW9uYWxQcm9wZXJ0eT4KCQkJPC9Db25kaXRpb25hbFByb3BlcnRpZXM+CgkJPC9DaG9pY2VEYXRhRWxlbWVudD4KCTwvRGF0YUVsZW1lbnRzPgkKCgoJPFJ1bGVzPgoJCTxEZWNpc2lvblBvaW50IElkPSJIZWxsb0Fzc2lzdCI+CgkJCTxMYWJlbD5IZWxsbyBBc3Npc3Q8L0xhYmVsPgoJCQk8QnJhbmNoPgoJCQkJPExhYmVsPk5vIGZvbGxvdy11cCByZXF1aXJlZDwvTGFiZWw+CgkJCQk8QW5kQ29uZGl0aW9uPgoJCQkJCTxFcXVhbENvbmRpdGlvbiBEYXRhRWxlbWVudElkPSJTaXplIiBDb21wYXJpc29uVmFsdWU9IjEiLz4KCQkJCTwvQW5kQ29uZGl0aW9uPgoJCQkJPEVuZFBvaW50UmVmIEVuZFBvaW50SWQ9Ik5vRlUiIERpYWdyYW1JZD0iS2V5RGlhZ3JhbUJyYW5jaF8xIj48L0VuZFBvaW50UmVmPgoJCQk8L0JyYW5jaD4KCQkJPEJyYW5jaD4KCQkJCTxMYWJlbD5Gb2xsb3ctdXAgaXMgcmVjb21tZW5kZWQgaW4gNiBtb250aHM8L0xhYmVsPgoJCQkJPEFuZENvbmRpdGlvbj4KCQkJCQk8RXF1YWxDb25kaXRpb24gRGF0YUVsZW1lbnRJZD0iU2l6ZSIgQ29tcGFyaXNvblZhbHVlPSIyIi8+CgkJCQkJPEVxdWFsQ29uZGl0aW9uIERhdGFFbGVtZW50SWQ9IkVuaGFuY2VtZW50IiBDb21wYXJpc29uVmFsdWU9Ik4iLz4KCQkJCTwvQW5kQ29uZGl0aW9uPgoJCQkJPEVuZFBvaW50UmVmIEVuZFBvaW50SWQ9Im1vRlUiIERpYWdyYW1JZD0iS2V5RGlhZ3JhbUJyYW5jaF8zIj48L0VuZFBvaW50UmVmPgoJCQk8L0JyYW5jaD4gCgkJCTxCcmFuY2g+CgkJCQk8TGFiZWw+U2NoZWR1bGUgYW4gaW1tZWRpYXRlIGZvbGxvdy11cDwvTGFiZWw+CgkJCQk8QW5kQ29uZGl0aW9uPgoJCQkJCTxFcXVhbENvbmRpdGlvbiBEYXRhRWxlbWVudElkPSJTaXplIiBDb21wYXJpc29uVmFsdWU9IjIiLz4KCQkJCQk8RXF1YWxDb25kaXRpb24gRGF0YUVsZW1lbnRJZD0iRW5oYW5jZW1lbnQiIENvbXBhcmlzb25WYWx1ZT0iWSIvPgoJCQkJPC9BbmRDb25kaXRpb24+CgkJCQk8RW5kUG9pbnRSZWYgRW5kUG9pbnRJZD0ibXVzdEZVIiBEaWFncmFtSWQ9IktleURpYWdyYW1CcmFuY2hfMiI+PC9FbmRQb2ludFJlZj4KCQkJPC9CcmFuY2g+CgkJPC9EZWNpc2lvblBvaW50PgoJPC9SdWxlcz4KCgk8RW5kUG9pbnRzPgoJCTxFbmRQb2ludCBJZD0iTm9GVSI+CgkJCTxMYWJlbD5ObyBGL1U8L0xhYmVsPgoJCQk8UmVwb3J0U2VjdGlvbnM+CgkJCQk8UmVwb3J0U2VjdGlvbiBTZWN0aW9uSWQ9ImZpbmRpbmdzIj4KCQkJCQk8QnJhbmNoPgoJCQkJCQk8UmVwb3J0VGV4dCBUeXBlPSJQbGFpblRleHQiPk5vIGZvbGxvdy11cCByZXF1aXJlZDwvUmVwb3J0VGV4dD4KCQkJCQk8L0JyYW5jaD4KCQkJCQk8QnJhbmNoPgoJCQkJCQk8UmVwb3J0VGV4dCBUeXBlPSJQbGFpblRleHQiPk5vIGZvbGxvdy11cCByZXF1aXJlZDwvUmVwb3J0VGV4dD4KCQkJCQk8L0JyYW5jaD4KCQkJCTwvUmVwb3J0U2VjdGlvbj4KCQkJPC9SZXBvcnRTZWN0aW9ucz4KCQk8L0VuZFBvaW50PgoKCQk8RW5kUG9pbnQgSWQ9Im1vRlUiPgoJCQk8TGFiZWw+Ri9VIGluIDZtbzwvTGFiZWw+CgkJCTxSZXBvcnRTZWN0aW9ucz4KCQkJCTxSZXBvcnRTZWN0aW9uIFNlY3Rpb25JZD0iZmluZGluZ3MiPgoJCQkJCTxCcmFuY2g+CgkJCQkJCTxSZXBvcnRUZXh0IFR5cGU9IlBsYWluVGV4dCI+Rm9sbG93LXVwIGlzIHJlY29tbWVuZGVkIGluIDYgbW9udGhzPC9SZXBvcnRUZXh0PgoJCQkJCTwvQnJhbmNoPgoJCQkJPC9SZXBvcnRTZWN0aW9uPgoJCQk8L1JlcG9ydFNlY3Rpb25zPgoJCTwvRW5kUG9pbnQ+CgoJCTxFbmRQb2ludCBJZD0ibXVzdEZVIj4KCQkJPExhYmVsPkltbWVkaWF0ZSBmL3U8L0xhYmVsPgoJCQk8UmVwb3J0U2VjdGlvbnM+CgkJCQk8UmVwb3J0U2VjdGlvbiBTZWN0aW9uSWQ9ImZpbmRpbmdzIj4KCQkJCQk8QnJhbmNoPgoJCQkJCQk8UmVwb3J0VGV4dCBUeXBlPSJQbGFpblRleHQiPlNjaGVkdWxlIGFuIGltbWVkaWF0ZSBmb2xsb3ctdXA8L1JlcG9ydFRleHQ+CgkJCQkJPC9CcmFuY2g+CgkJCQk8L1JlcG9ydFNlY3Rpb24+CgkJCTwvUmVwb3J0U2VjdGlvbnM+CgkJPC9FbmRQb2ludD4KCTwvRW5kUG9pbnRzPgoKPC9SZXBvcnRpbmdNb2R1bGU+CgoKCgoK');
    // console.log(test);
    // myTest.Base64.Encode();
  }
}
