import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ViewChild } from '@angular/core';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import { Template } from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';
import { EndPointRef } from '../../core/models/endpointref.model';

import { TemplatePartial } from '../../core/endpoint/template-partial';
import { Console } from '@angular/core/src/console';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { SimulatorState } from '../../core/models/simulator-state.model';
import { SelectedCondition } from '../../core/models/executed-result.model';
import { InputData } from '../../core/models/input-data.model';
import { AssistChoiceElementComponent } from './assist-choice-element/assist-choice-element.component';
import { ChoiceDataElement } from '../../core/elements/models/choice-data-element-model';
// import { AssistNumericElementComponent } from './assist-numeric-element/assist-numeric-element.component';
import { SimulatorCommunicationService } from '../shared/services/simulator-communication.service';
import { RepeatedElementModel } from '../../core/elements/models/repeatedElement.model';
import { RepeatedElementSections } from '../../core/elements/models/RepeatedElementSections';
import { ResetCommunicationService } from '../shared/services/reset-communication.service';
import { Subscription } from 'rxjs';
// import { RepeatableElementRegisterService } from '../shared/services/repeatable-element-register.service';
import * as _ from 'lodash';
const $ = require('jquery');

@Component({
  selector: 'acr-assist-data-element',
  templateUrl: './assist-data-element.component.html',
  styleUrls: ['./assist-data-element.component.css', '../styles.css']
})

export class AssistDataElementComponent implements OnInit, OnChanges {
  subscription: Subscription;
  @Input() dataElements: BaseDataElement[];
  @Input() $dataElements: BaseDataElement[];
  @Input() imagePath: string;
  @Input() Endpoints = [];
  @Input() templatePartial: string[];
  @Input() endPointXMLString: string[];
  @Input() xmlContent: string;
  @Output() returnReportText: EventEmitter<MainReportText> = new EventEmitter<MainReportText>();
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();
  @Output() returnDataElementChanged: EventEmitter<InputData[]> = new EventEmitter<InputData[]>();
  @Input() isReset: boolean;
  @Input() inputValues: InputData[] = [];
  @Output() callBackAfterGettingShowKeyDiagram : EventEmitter<string> = new EventEmitter<string>();
  mainReportTextObj: MainReportText;
  simulatorState: SimulatorState;
  dataElementValues: Map<string, any>;
  comparisonValues: string[] = [];
  selectedChoiceValues: string[] = [];
  executedResultIds: any[] = [];
  executedResultHistories: ExecutedResultHistory[] = [];

  IsRepeating: boolean;
  $RepeatedElementModel: any[] = [];
  constructor(private simulatorEngineService: SimulatorEngineService,
    private simulatorCommunicationService: SimulatorCommunicationService,
    resetCommunicationService: ResetCommunicationService
    ) {
    this.subscription = resetCommunicationService.resetSource$.subscribe(
      mission => {
        this.IsRepeating = false;
        this.$RepeatedElementModel = [];
      });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.IsRepeating = false;
    this.simulatorEngineService.simulatorStateChanged.subscribe((message) => {
      this.simulatorState = message as SimulatorState;
      this.dataElementValues = this.simulatorEngineService.getAllDataElementValues();
      // const nonRelevantIDs = this.simulatorEngineService.evaluateDecisionAndConditionalProperty();

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
        if (this.dataElementValues[dataElement.id] !== undefined && dataElement.currentValue !== this.dataElementValues[dataElement.id]) {
          dataElement.currentValue = this.dataElementValues[dataElement.id];
        }
        dataElement.currentValue = (dataElement.currentValue !== undefined) ? dataElement.currentValue : this.dataElementValues[dataElement.id];
      }

      const $mainReportText = new MainReportText();
      $mainReportText.allReportText = new Array<AllReportText>();
      const allReportText = new AllReportText();

      this.dataElements =  Object.keys(this.dataElements).map(i => this.dataElements[i]);
      this.dataElements = this.dataElements.filter(x => x.displaySequence != null).sort(function (DE_1, DE_2) { return DE_1.displaySequence - DE_2.displaySequence; });
      if (this.simulatorState.endPointIds && this.simulatorState.endPointIds.length > 0) {
        $mainReportText.reportTextMainContent = '';
        for (const evaluationResult of this.simulatorState.ruleEvaluationResults) {
          allReportText.repeatedSectionName = evaluationResult.repeatedSectionName;
          allReportText.allReportResult = Object.create(new AllReportResult());
          allReportText.allReportResult.sectionId = evaluationResult.ruleEvaluationReportResult.sectionId;
          allReportText.allReportResult.reportText = evaluationResult.ruleEvaluationReportResult.reportText;
          allReportText.repeatedSectionName = evaluationResult.repeatedSectionName;
          $mainReportText.allReportText.push(Object.assign({}, allReportText));
        }
      } else {
        $mainReportText.allReportText = [];
      }

      if ($mainReportText !== undefined && $mainReportText.allReportText.length > 0) {
        this.returnReportText.emit($mainReportText);
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

  ngOnChanges(changes: SimpleChanges): void {
    this.dataElements =  Object.keys(this.dataElements).map(i => this.dataElements[i]);
    this.dataElements = this.dataElements.filter(x => x.displaySequence != null).sort(function (DE_1, DE_2) { return DE_1.displaySequence - DE_2.displaySequence; });
    this.executedResultIds = [];

    this.$dataElements = [];
    for (const dataelement of this.dataElements) {
      if (!dataelement.isRepeatable) {
        this.$dataElements.push(dataelement);
      }
    }

    this.simulatorEngineService.evaluateDecisionPoints();
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

        if (this.simulatorState.endPointId && this.simulatorState.endPointId.length > 0) {
          this.generateExecutionHistory();
        }
        this.afterDataElementChanged();
      }
    } else {
      this.afterDataElementChanged();
    }
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

      this.ResetRepeatedElements($event);
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
            this.dataElementValues[item.id] = undefined;
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

  ResetRepeatedElements($event) {
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

        if (this.simulatorState.endPointId && this.simulatorState.endPointId.length > 0) {
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
        this.simulatorEngineService.addOrUpdateDataElement($event.receivedElement.elementId, $event.receivedElement.selectedComparisonValues,
          $event.receivedElement.selectedValues);
        const executedResults: string[] = [];
        executedResults[$event.selectedCondition.selectedCondition] = $event.selectedCondition.selectedValue;
        this.executedResultIds[$event.selectedCondition.selectedConditionId] = executedResults;

        if (this.simulatorState.endPointId && this.simulatorState.endPointId.length > 0) {
          this.generateExecutionHistory();
        }
        this.afterDataElementChanged();
      }
    } else {
      this.afterDataElementChanged();
    }
  }

  generateReportText(endpointId: string) {
    // endpointId = 'ReporttextTR1';
    const endpointContent = this.returnEndPointContents(this.xmlContent, '<EndPoint Id="' + endpointId + '">', '</EndPoint>');
    // this.parseXml(endpointId, endpointContent);
  }

  afterDataElementChanged() {
    const deValues: InputData[] = [];
    for (const de of this.dataElements) {
      if (de.isVisible && de.dataElementType !== 'ComputedDataElement' && de.dataElementType !== 'GlobalValue') {
        const inputData = new InputData();
        inputData.dataElementId = de.id;
        inputData.dataElementLabel = de.label;
        inputData.dataElementValue = de.currentValue;

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
          } else {
            inputData.dataElementDisplayValue = de.currentValue;
          }
        }
        deValues.push(inputData);
      }
    }

    this.returnDataElementChanged.emit(deValues);
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
          const executedResultHistory: ExecutedResultHistory = new ExecutedResultHistory();

          executedResultHistory.resultCondition = label;
          executedResultHistory.resultValue = this.executedResultIds[resultId][label];

          this.executedResultHistories.push(executedResultHistory);
        }
      }
    }
    const finalExecution: FinalExecutedHistory = new FinalExecutedHistory();
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

  private returnEndPointContents(content: string, startToken: string, endToken: string): string {
    let contents: string;
    let templateSearchIndexPosition = 0;
    while (true) {
      const contentStartPosition = content.indexOf(startToken, templateSearchIndexPosition);
      const contentEndPosition = content.indexOf(endToken, templateSearchIndexPosition);

      if (contentStartPosition >= 0 && contentEndPosition >= 0) {
        const endPosition = contentEndPosition + endToken.length;
        const contentData = content.substring(contentStartPosition, endPosition);
        contents = contentData;
        templateSearchIndexPosition = endPosition + 1;
      } else {
        break;
      }
    }
    return contents;
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

export class MainReportText {
  reportTextMainContent: string;
  allReportText: AllReportText[];
}
export class AllReportText {
  repeatedSectionName: string;
  allReportResult: AllReportResult;
  constructor() {
    this.allReportResult = new AllReportResult();
  }
}

export class AllReportResult {
  sectionId: string;
  reportText: string;
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
