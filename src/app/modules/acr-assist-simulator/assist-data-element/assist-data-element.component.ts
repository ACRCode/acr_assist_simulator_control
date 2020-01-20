import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { SimulatorState } from '../../core/models/simulator-state.model';
import { InputData } from '../../core/models/input-data.model';
import { BaseDataElement, ChoiceDataElement } from 'testruleengine/Library/Models/Class';
import { SimulatorCommunicationService } from '../shared/services/simulator-communication.service';
import { RepeatedElementModel } from '../../core/elements/models/repeatedElement.model';
import { RepeatedElementSections } from '../../core/elements/models/RepeatedElementSections';
import { ResetCommunicationService } from '../shared/services/reset-communication.service';
import { ChoiceElementDisplayEnum } from '../../core/models/choice-element-display.enum';
import { TabularReport } from '../../core/models/tabular-report.model';
import { UtilityService } from '../../core/services/utility.service';
import { MainReportText } from 'testruleengine/Library/Models/Class';

import * as _ from 'lodash';
import { TabularReportElements } from '../../core/models/tabular-report-elements.model';
const $ = require('jquery');

@Component({
  selector: 'acr-assist-data-element',
  templateUrl: './assist-data-element.component.html',
  styleUrls: ['./assist-data-element.component.css', '../styles.css']
})

export class AssistDataElementComponent implements OnInit, OnChanges, OnDestroy {

  mainReportTextObj: MainReportText;
  simulatorState: SimulatorState;
  dataElementValues: Map<string, any>;
  comparisonValues: string[] = [];
  selectedChoiceValues: string[] = [];
  executedResultIds: any[] = [];
  executedResultHistories: ExecutedResultHistory[] = [];
  IsRepeating: boolean;
  $RepeatedElementModel: any[] = [];
  resetSourceSubscription: ISubscription;
  simulatorStateSubscription: ISubscription;

  @Input() showTabularReportText: boolean;
  @Input() choiceElementDisplay: ChoiceElementDisplayEnum;
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() dataElements: BaseDataElement[];
  @Input() assetsBaseUrl: string;
  @Input() $dataElements: BaseDataElement[];
  @Input() Endpoints = [];
  @Input() templatePartial: string[];
  @Input() endPointXMLString: string[];
  @Input() xmlContent: string;
  @Input() isReset: boolean;
  @Input() inputValues: InputData[] = [];
  @Output() callBackAfterGettingShowKeyDiagram: EventEmitter<string> = new EventEmitter<string>();
  @Output() returnReportText: EventEmitter<MainReportText> = new EventEmitter<MainReportText>();
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();
  @Output() returnDataElementChanged: EventEmitter<InputData[]> = new EventEmitter<InputData[]>();
  @Output() callBackAfterAIInputReset: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private simulatorEngineService: SimulatorEngineService,
    private utilityService: UtilityService,
    private simulatorCommunicationService: SimulatorCommunicationService,
    resetCommunicationService: ResetCommunicationService
  ) {
    this.resetSourceSubscription = resetCommunicationService.resetSource$.subscribe(
      mission => {
        this.IsRepeating = false;
        this.$RepeatedElementModel = [];
      });
  }

  ngOnInit(): void {
    this.IsRepeating = false;
    this.simulatorStateSubscription = this.simulatorEngineService.simulatorStateChanged.subscribe((message) => {
      this.simulatorState = message as SimulatorState;

      this.dataElements.filter(x => x.canPrefillFromSource === true).forEach(_dataElement => {
        _dataElement.currentValue = undefined;
        this.dataElementValues.set(_dataElement.id, undefined);
      });

      this.mainReportTextObj = this.simulatorState.mainReportText;
      if (this.mainReportTextObj !== undefined && this.mainReportTextObj.setValues !== undefined
        && this.mainReportTextObj.setValues.setDataElementValue !== undefined &&
        this.mainReportTextObj.setValues.setDataElementValue.length > 0) {
        this.mainReportTextObj.setValues.setDataElementValue.forEach(_setValues => {
          const _dataElementWithFilter = this.dataElements.filter(x => x.id === _setValues.dataElementId
            && x.canPrefillFromSource === true);
          if (_dataElementWithFilter !== undefined && _dataElementWithFilter[0] !== undefined) {
            _dataElementWithFilter[0].currentValue = _setValues.value;
            this.dataElementValues.set(_setValues.dataElementId, _setValues.value);
          }
        });
      }

      this.dataElementValues = this.simulatorEngineService.getAllDataElementValues();

      const showKeyDiagram = this.simulatorState.showKeyDiagram;
      const nonRelevantIDs = this.simulatorState.nonRelevantDataElementIds;
      for (const dataElement of this.dataElements) {
        if (nonRelevantIDs && nonRelevantIDs.length > 0) {
          if (nonRelevantIDs.indexOf(dataElement.id) >= 0) {
            dataElement.isVisible = false;
          } else {
            dataElement.isVisible = true;
          }
        } else {
          dataElement.isVisible = true;
        }
        // tslint:disable-next-line: max-line-length
        if (this.dataElementValues.get(dataElement.id) !== undefined && dataElement.currentValue !== this.dataElementValues.get(dataElement.id)) {
          dataElement.currentValue = this.dataElementValues.get(dataElement.id);
        }
        // tslint:disable-next-line: max-line-length
        dataElement.currentValue = (dataElement.currentValue !== undefined) ? dataElement.currentValue : this.dataElementValues.get(dataElement.id);
      }

      this.dataElements = Object.keys(this.dataElements).map(i => this.dataElements[i]);
      // tslint:disable-next-line: max-line-length
      this.dataElements = this.dataElements.filter(x => x.displaySequence != null).sort(function(DE_1, DE_2) { return DE_1.displaySequence - DE_2.displaySequence; });

      if (this.showTabularReportText) {
        this.mainReportTextObj = new MainReportText();
        this.mainReportTextObj.tabularReport = this.createTabularReport();
        if (this.utilityService.isValidInstance(this.mainReportTextObj.tabularReport) &&
            this.utilityService.isNotEmptyArray(this.mainReportTextObj.tabularReport.elements)) {
          this.returnReportText.emit(this.mainReportTextObj);
        } else {
          this.returnReportText.emit(undefined);
        }
      } else if (this.mainReportTextObj !== undefined && this.mainReportTextObj.allReportText.length > 0) {
        this.returnReportText.emit(this.mainReportTextObj);
      } else {
        this.returnReportText.emit(undefined);
      }

      this.$dataElements = [];
      for (const dataelement of this.dataElements) {
        if (!dataelement.isRepeatable) {
          this.$dataElements.push(dataelement);
        }
      }

      this.callBackAfterGettingShowKeyDiagram.emit(showKeyDiagram);
      this.simulatorCommunicationService.messageEmitter('');
    });
  }

  ngOnChanges(): void {
    this.dataElements = Object.keys(this.dataElements).map(i => this.dataElements[i]);
    // tslint:disable-next-line: max-line-length
    this.dataElements = this.dataElements.filter(x => x.displaySequence != null).sort(function(DE_1, DE_2) { return DE_1.displaySequence - DE_2.displaySequence; });
    this.executedResultIds = [];

    this.$dataElements = [];
    for (const dataelement of this.dataElements) {
      if (!dataelement.isRepeatable) {
        this.$dataElements.push(dataelement);
      }
    }

    this.simulatorEngineService.evaluateDecisionPoints();
  }

  ngOnDestroy() {
    if (this.utilityService.isValidInstance(this.resetSourceSubscription)) {
      this.resetSourceSubscription.unsubscribe();
    }
    if (this.utilityService.isValidInstance(this.simulatorStateSubscription)) {
      this.simulatorStateSubscription.unsubscribe();
    }
  }

  choiceSelected($event) {
    if ($event !== undefined) {
      if ($event.receivedElement !== undefined && $event.selectedCondition !== undefined) {
        this.selectedChoiceValues[$event.receivedElement.elementId + 'SelectedValue'] = $event.receivedElement.selectedText;
        this.simulatorEngineService.addOrUpdateDataElement($event.receivedElement.elementId, $event.receivedElement.selectedValue,
          $event.receivedElement.selectedText);
        const executedResults: string[] = [];
        executedResults[$event.selectedCondition.selectedCondition] = $event.selectedCondition.selectedValue;
        this.executedResultIds[$event.selectedCondition.selectedConditionId] = executedResults;
        if (this.simulatorState.endPointIds && this.simulatorState.endPointIds.length > 0) {
          this.generateExecutionHistory();
        }
        this.afterDataElementChanged();
      }
    } else {
      this.afterDataElementChanged();
    }
  }

  numericSelected($event) {
    if ($event !== undefined) {
      if ($event.receivedElement !== undefined && $event.selectedCondition !== undefined) {
        this.FindRepeatedElements($event);
        this.simulatorEngineService.addOrUpdateDataElement($event.receivedElement.elementId, $event.receivedElement.selectedValue,
          $event.receivedElement.selectedValue);
        const executedResults: string[] = [];
        executedResults[$event.selectedCondition.selectedCondition] = $event.selectedCondition.selectedValue;
        this.executedResultIds[$event.selectedCondition.selectedConditionId] = executedResults;

        if (this.simulatorState.endPointIds && this.simulatorState.endPointIds.length > 0) {
          this.generateExecutionHistory();
        }
        this.afterDataElementChanged();
      }
    } else {
      this.afterDataElementChanged();
    }
  }

  onAIInputReset(event) {
    this.callBackAfterAIInputReset.emit(event);
  }

  IsAnyRepeatElementsExist(event): boolean {
    let isExist = false;
    for (const item of this.dataElements) {
      if (item.isRepeatable === true && item.repeatRefID === event.receivedElement.elementId) {
        isExist = true;
        break;
      }
    }

    return isExist;
  }

  FindRepeatedElements($event) {
    // RepeatableElementRegisterService.ClearRepeatableDataElementsGroupName();
    if (this.IsAnyRepeatElementsExist($event)) {
      this.IsRepeating = false;
      const $repeatedElementModel = new RepeatedElementModel();

      this.resetRepeatedElements($event);
      for (const item of this.dataElements) {
        if (item.id === $event.receivedElement.elementId) {
          $repeatedElementModel.ParentElement = item;
          $repeatedElementModel.ParentElementId = $event.receivedElement.elementId;
        }
      }

      for (let i = 0; i < $event.receivedElement.selectedValue; i++) {
        const repeatedElementSection = new RepeatedElementSections();
        for (const item of this.dataElements) {
          if (item.isRepeatable === true && item.repeatRefID === $event.receivedElement.elementId) {
            // this.IsRepeating = true;
            repeatedElementSection.SectionName = item.repeatGroup + ' ' + + (i + 1);
            repeatedElementSection.SectionId = item.repeatGroup.replace(/[\s]/g, '') + +(i + 1);
            item.id = item.id.split('_')[0] + '_' + item.repeatGroup.replace(/[\s]/g, '') + +(i + 1);
            item.currentValue = undefined;
            this.dataElementValues.set(item.id, undefined);
            const $item = Object.assign([], item);
            repeatedElementSection.ChildElements.push($item);
          }
        }

        $repeatedElementModel.RepeatedElementSections.push(repeatedElementSection);
      }

      // RepeatableElementRegisterService.SetRepeatableDataElementsGroupName($repeatedElementModel);
      this.$RepeatedElementModel.push($repeatedElementModel);
      this.IsRepeating = this.$RepeatedElementModel.length > 0 ? true : false;
    }
  }

  resetRepeatedElements($event) {
    for (let index = 0; index < this.$RepeatedElementModel.length; index++) {
      if (this.$RepeatedElementModel[index].ParentElementId === $event.receivedElement.elementId) {
        this.$RepeatedElementModel.splice(index, 1);
      }
    }
  }

  dateTimeSelected($event) {
    if ($event !== undefined) {
      if ($event.receivedElement !== undefined && $event.selectedCondition !== undefined) {
        this.simulatorEngineService.addOrUpdateDataElement($event.receivedElement.elementId, $event.receivedElement.selectedValue,
          $event.receivedElement.selectedValue);
        const executedResults: string[] = [];
        executedResults[$event.selectedCondition.selectedCondition] = $event.selectedCondition.selectedValue;
        this.executedResultIds[$event.selectedCondition.selectedConditionId] = executedResults;

        if (this.simulatorState.endPointIds && this.simulatorState.endPointIds.length > 0) {
          this.generateExecutionHistory();
        }
        this.afterDataElementChanged();
      }
    } else {
      this.afterDataElementChanged();
    }
  }

  multiSelected($event) {
    if ($event !== undefined) {
      if ($event.receivedElement !== undefined && $event.selectedCondition !== undefined) {
        this.comparisonValues[$event.receivedElement.elementId + 'ComparisonValue'] = $event.receivedElement.selectedComparisonValues;
        // tslint:disable-next-line: max-line-length
        this.simulatorEngineService.addOrUpdateDataElement($event.receivedElement.elementId, $event.receivedElement.selectedComparisonValues,
          $event.receivedElement.selectedValues);
        const executedResults: string[] = [];
        executedResults[$event.selectedCondition.selectedCondition] = $event.selectedCondition.selectedValue;
        this.executedResultIds[$event.selectedCondition.selectedConditionId] = executedResults;

        if (this.simulatorState.endPointIds && this.simulatorState.endPointIds.length > 0) {
          this.generateExecutionHistory();
        }
        this.afterDataElementChanged();
      }
    } else {
      this.afterDataElementChanged();
    }
  }

  afterDataElementChanged() {
    const deValues: InputData[] = [];
    for (const de of this.dataElements) {
      if (de.isVisible && de.dataElementType !== 'ComputedDataElement' && de.dataElementType !== 'GlobalValue') {
        const inputData = new InputData();
        inputData.dataElementId = de.id;
        inputData.dataElementLabel = de.label;
        if (de.dataElementType !== 'MultiChoiceDataElement') {
          inputData.dataElementValue = de.currentValue;
        }

        if (de.currentValue === undefined || de.currentValue === '') {
          inputData.dataElementDisplayValue = undefined;
        } else {
          if (de.dataElementType === 'ChoiceDataElement') {
            const choices = (de as ChoiceDataElement).choiceInfo;
            const choice = choices.filter(ch => ch.value === de.currentValue);
            if (choice !== undefined && choice.length) {
              inputData.dataElementDisplayValue = choices.filter(ch => ch.value === de.currentValue)[0].label;
            } else {
              inputData.dataElementDisplayValue = de.currentValue;
            }
          } else if (de.dataElementType === 'MultiChoiceDataElement') {
            const choices = (de as ChoiceDataElement).choiceInfo;
            inputData.dataElementDisplayValue = [];

            if (!(de.currentValue instanceof Array)) {
              inputData.dataElementValue = [de.currentValue];
            } else {
              inputData.dataElementValue = de.currentValue;
            }

            choices.forEach(choice => {
              if (Array.isArray(de.currentValue)) {
                de.currentValue.forEach(element => {
                  if (choice.value === element) {
                    inputData.dataElementDisplayValue.push(choice.label);
                  }
                });
              } else {
                if (choice.value === de.currentValue) {
                  inputData.dataElementDisplayValue.push(choice.label);
                }
              }
            });

            if (inputData.dataElementDisplayValue === undefined && inputData.dataElementDisplayValue !== null) {
              inputData.dataElementDisplayValue = this.removeDuplicates(inputData.dataElementDisplayValue);
            }

            if (inputData.dataElementValue !== undefined && inputData.dataElementValue != null) {
              inputData.dataElementValue = this.removeDuplicates(inputData.dataElementValue);
            }
          } else {
            inputData.dataElementDisplayValue = de.currentValue;
          }
        }
        deValues.push(inputData);
      }
    }

    this.returnDataElementChanged.emit(deValues);
  }

  removeDuplicates(arr) {
    const unique_array = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < arr.length; i++) {
      if (unique_array.indexOf(arr[i]) === -1) {
        unique_array.push(arr[i]);
      }
    }

    return unique_array;
  }

  private generateExecutionHistory() {
    this.executedResultHistories = [];
    let isNonRelevant: boolean;
    isNonRelevant = false;
    // tslint:disable-next-line:forin
    for (const resultId in this.executedResultIds) {
      for (const nonRelevantDataElement of this.simulatorState.nonRelevantDataElementIds) {
        if (nonRelevantDataElement === resultId) {
          isNonRelevant = true;
          break;
        } else {
          isNonRelevant = false;
        }
      }
      if (!isNonRelevant) {
        // tslint:disable-next-line:forin
        for (const label in this.executedResultIds[resultId]) {
          // tslint:disable-next-line: no-use-before-declare
          const executedResultHistory = new ExecutedResultHistory();

          executedResultHistory.resultCondition = label;
          executedResultHistory.resultValue = this.executedResultIds[resultId][label];

          this.executedResultHistories.push(executedResultHistory);
        }
      }
    }
    // tslint:disable-next-line: no-use-before-declare
    const finalExecution = new FinalExecutedHistory();
    if (this.executedResultHistories.length > 0) {
      finalExecution.executionHistories = this.executedResultHistories;
      finalExecution.resultText = this.mainReportTextObj;
      finalExecution.inputData = [];

      for (const de of this.dataElements) {
        if (de.isVisible && de.dataElementType !== 'ComputedDataElement' && de.dataElementType !== 'GlobalValue') {
          const inputData = new InputData();
          inputData.dataElementId = de.id;
          inputData.dataElementValue = de.currentValue;
          finalExecution.inputData.push(inputData);
        }
      }
    }

    this.returnExecutionHistory.emit(finalExecution);
  }

  private createTabularReport(): TabularReport {
    const dataElementTexts = this.simulatorEngineService.getAllDataElementTexts()[Symbol.iterator]();
    const template = this.simulatorEngineService.getTemplate();
    const tabularReport = new TabularReport();
    tabularReport.elements = new Array<TabularReportElements>();
    tabularReport.label = template.metadata.label;

    if (this.utilityService.isValidInstance(template.metadata.codableConcept) &&
      this.utilityService.isNotEmptyArray(template.metadata.codableConcept.coding)) {
        tabularReport.identifier = template.metadata.codableConcept.coding[0].code;
    }

    for (const value of dataElementTexts) {
      const hasValidValue = Array.isArray(value[1]) ?
        this.utilityService.isNotEmptyArray(value[1]) : this.utilityService.isNotEmptyString(value[1]);
      if (hasValidValue) {
        const dataElement = template.dataElements.find(x => x.id === value[0] &&
          x.dataElementType !== 'ComputedDataElement' && x.dataElementType !== 'GlobalValue');
        if (this.utilityService.isValidInstance(dataElement)) {
          let radElementId: string;
          if (this.utilityService.isValidInstance(dataElement.codableConcept) &&
            this.utilityService.isNotEmptyArray(dataElement.codableConcept.coding)) {
            radElementId = dataElement.codableConcept.coding[0].code;
          }

          const element = new TabularReportElements();
          element.dataElement = dataElement.label;
          element.radElement = radElementId;
          element.values = value[1];
          tabularReport.elements.push(element);
        }
      }
    }

    return tabularReport;
  }
}

export class ChoiceElement {
  elementId: string;
  selectedValue: string;
  selectedText: string;
}

export class NumericElement {
  elementId: string;
  selectedValue: number;
}

export class DateTimeElement {
  elementId: string;
  selectedValue: string;
}

export class MultiChoiceElement {
  elementId: string;
  selectedValues: string[];
  selectedComparisonValues: string[];
}

export class AllElements {
  elementId: string;
  selectedValues: any[];
}

export class ExecutedResultHistory {
  resultCondition: string;
  resultValue: any;
}

export class FinalExecutedHistory {
  executionHistories: ExecutedResultHistory[];
  resultText: MainReportText;
  inputData: InputData[];
}
