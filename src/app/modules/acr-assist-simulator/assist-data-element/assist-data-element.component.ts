import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import {Template} from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';
import { EndPointRef } from '../../core/models/endpointref.model';
import { SectionIfValueNotCondition } from '../../core/endpoint/section-if-value-not-condition';
import { SectionIfValueCondition } from '../../core/endpoint/section-if-value-condition';
import { TemplatePartial } from '../../core/endpoint/template-partial';
import { Console } from '@angular/core/src/console';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { SimulatorState } from '../../core/models/simulator-state.model';
import { SelectedCondition } from '../../core/models/executed-result.model';
import { InputData } from '../../core/models/input-data.model';
import { AssistChoiceElementComponent } from './assist-choice-element/assist-choice-element.component';
const $ = require('jquery');

@Component({
  selector: 'acr-assist-data-element',
  templateUrl: './assist-data-element.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AssistDataElementComponent implements OnInit, OnChanges {

  @Input() dataElements: BaseDataElement[];
  @Input() imagePath: string;
  @Input() Endpoints = [];
  @Input() templatePartial: string[];

  @Input() endPointXMLString: string[];
  @Input() xmlContent: string;
  @Output() returnReportText: EventEmitter<MainReportText> = new EventEmitter<MainReportText>();
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();
  @Input() isReset: boolean;
  mainReportTextObj: MainReportText;
  simulatorState: SimulatorState;
  dataElementValues: Map<string, any>;
  comparisonValues: string[] = [];
  selectedChoiceValues: string[] = [];
  executedResultIds: any[] = [];
  executedResultHistories: ExecutedResultHistory[] = [];
  @Input() inputValues: InputData[] = [];
  constructor (private simulatorEngineService: SimulatorEngineService) {

  }


  ngOnInit(): void {
    this.simulatorEngineService.simulatorStateChanged.subscribe((message) => {
      this.simulatorState =  message as  SimulatorState;
        this.dataElementValues = this.simulatorEngineService.getAllDataElementValues();
        for (const dataElement of this.dataElements) {
        if (this.simulatorState.nonRelevantDataElementIds && this.simulatorState.nonRelevantDataElementIds.length > 0) {
          if  (this.simulatorState.nonRelevantDataElementIds.indexOf(dataElement.id) >= 0 ) {
              dataElement.isVisible = false;
          } else {
            dataElement.isVisible = true;
          }
        } else {
             dataElement.isVisible = true;
        }
        dataElement.currentValue = (dataElement.currentValue !== undefined) ? dataElement.currentValue : this.dataElementValues[dataElement.id];
      }

      if (this.simulatorState.endPointId &&  this.simulatorState.endPointId.length > 0) {
          this.generateReportText(this.simulatorState.endPointId);
      } else {
        this.returnReportText.emit(undefined);
      }

    });
  }




  ngOnChanges(changes: SimpleChanges): void {
    this.dataElements = this.dataElements.filter(x => x.displaySequence != null).sort(function (DE_1, DE_2) { return DE_1.displaySequence - DE_2.displaySequence; });
  }

  choiceSelected($event) {
    if ($event.receivedElement !== undefined && $event.selectedCondition !== undefined) {
      this.selectedChoiceValues[$event.receivedElement.elementId + 'SelectedValue'] = $event.receivedElement.selectedText;
      this.simulatorEngineService.addOrUpdateDataElement($event.receivedElement.elementId , $event.receivedElement.selectedValue ,
        $event.receivedElement.selectedText);
      const executedResults: string[] = [];
      executedResults[$event.selectedCondition.selectedCondition] = $event.selectedCondition.selectedValue;
      this.executedResultIds[$event.selectedCondition.selectedConditionId] = executedResults;

      if (this.simulatorState.endPointId &&  this.simulatorState.endPointId.length > 0) {
        this.generateExecutionHistory();
      }
    }
  }

  numericSelected($event) {
    if ($event.receivedElement !== undefined && $event.selectedCondition !== undefined) {
      this.simulatorEngineService.addOrUpdateDataElement($event.receivedElement.elementId, $event.receivedElement.selectedValue ,
        $event.receivedElement.selectedValue);
      const executedResults: string[] = [];
      executedResults[$event.selectedCondition.selectedCondition] = $event.selectedCondition.selectedValue;
      this.executedResultIds[$event.selectedCondition.selectedConditionId] = executedResults;

      if (this.simulatorState.endPointId &&  this.simulatorState.endPointId.length > 0) {
        this.generateExecutionHistory();
      }
    }
  }

  multiSelected($event) {
    if ($event.receivedElement !== undefined && $event.selectedCondition !== undefined) {
      this.comparisonValues[$event.receivedElement.elementId + 'ComparisonValue'] = $event.receivedElement.selectedComparisonValues;
      this.simulatorEngineService.addOrUpdateDataElement($event.receivedElement.elementId, $event.receivedElement.selectedComparisonValues ,
        $event.receivedElement.selectedValues);
      const executedResults: string[] = [];
      executedResults[$event.selectedCondition.selectedCondition] = $event.selectedCondition.selectedValue;
      this.executedResultIds[$event.selectedCondition.selectedConditionId] = executedResults;

      if (this.simulatorState.endPointId &&  this.simulatorState.endPointId.length > 0) {
        this.generateExecutionHistory();
      }
    }
  }

  load (inputValues: InputData[], isReset: boolean) {
    if (inputValues !== undefined) {
      if (isReset) {
        $('select').prop('selectedIndex', 0);
      }
      this.returnReportText.emit(undefined);
      for (const inputValue of inputValues) {
        if (inputValue !== undefined) {
          for (const dataElement of this.dataElements) {
            if ( dataElement.id === inputValue.dataElementId) {
              switch (dataElement.dataElementType) {
                case 'ChoiceDataElement' :
                  if (inputValue.dataElementValue !== undefined) {
                    if (!isReset) {
                      $('#' + inputValue.dataElementValue + '_' + inputValue.dataElementId).prop('checked', true);
                      this.simulatorEngineService.addOrUpdateDataElement(inputValue.dataElementId, inputValue.dataElementValue,
                          inputValue.dataElementValue);
                    } else {
                      $('#' + inputValue.dataElementValue + '_' + inputValue.dataElementId).prop('checked', false);
                      // $('#' + inputValue.dataElementValue + '_' + inputValue.dataElementId).trigger('click');
                      this.isReset = true;
                    }
                  }
                  break;
                case 'IntegerDataElement' :
                  if (inputValue.dataElementValue !== undefined) {
                    if (!isReset) {
                      $('#' + inputValue.dataElementId).val(inputValue.dataElementValue);
                      this.simulatorEngineService.addOrUpdateDataElement(inputValue.dataElementId, inputValue.dataElementValue,
                        inputValue.dataElementValue);
                      $('#' + inputValue.dataElementId).trigger('change');
                    } else {
                      $('#' + inputValue.dataElementId).val('');
                      $('#' + inputValue.dataElementId).trigger('change');
                    }
                    const customEvent = document.createEvent('Event');
                    customEvent.initEvent('change', true, true);
                    $('#' + inputValue.dataElementId)[0].dispatchEvent(customEvent);
                  }
                  break;
                case 'NumericDataElement' :
                  if (inputValue.dataElementValue !== undefined) {
                    if (!isReset) {
                      $('#' + inputValue.dataElementId).val(inputValue.dataElementValue);
                      this.simulatorEngineService.addOrUpdateDataElement(inputValue.dataElementId, inputValue.dataElementValue,
                        inputValue.dataElementValue);
                      $('#' + inputValue.dataElementId).trigger('keyup');
                    } else {
                      $('#' + inputValue.dataElementId).val('');
                      $('#' + inputValue.dataElementId).trigger('keyup');
                    }
                    const customEvent = document.createEvent('Event');
                    customEvent.initEvent('change', true, true);
                    $('#' + inputValue.dataElementId)[0].dispatchEvent(customEvent);
                  }
                  break;
                case 'MultiChoiceDataElement' :
                  if (inputValue.dataElementValue !== undefined) {
                    const customEvent = document.createEvent('Event');
                    customEvent.initEvent('change', true, true);
                    if (inputValue.dataElementValue.length !== undefined && inputValue.dataElementValue.length > 0) {
                      if (!isReset) {
                        if (Array.isArray(inputValue.dataElementValue)) {
                          for (const element in inputValue.dataElementValue) { $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue[element]).prop('checked', true);
                            $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue[element])[0].dispatchEvent(customEvent);
                          }
                        } else {
                          $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue).prop('checked', true);
                          $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue)[0].dispatchEvent(customEvent);
                        }
                      } else {
                        if (Array.isArray(inputValue.dataElementValue)) {
                          for (const element in inputValue.dataElementValue) {
                            $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue[element]).prop('checked', false);
                            customEvent.initEvent('change', true, true);
                            $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue[element])[0].dispatchEvent(customEvent);
                          }
                        } else {
                          $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue).prop('checked', false);
                          $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue)[0].dispatchEvent(customEvent);
                        }
                      }
                      // if (isReset) {
                      //   for (const value in inputValue.dataElementValue) {
                      //     customEvent.initEvent('change', true, true);
                      //     $('#' + inputValue.dataElementId + '_' + inputValue.dataElementValue[value])[0].dispatchEvent(customEvent);
                      //   }
                      // }
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      } else {
        throw console.error('Invalid values');
      }
  }

  generateReportText(endpointId: string) {
    const endpointContent = this.returnEndPointContents(this.xmlContent, '<EndPoint Id="' + endpointId + '">' , '</EndPoint>');
    this.parseXml(endpointId, endpointContent);
  }

  private generateExecutionHistory () {
    this.executedResultHistories = [];
    let isNonRelevant: boolean;
    isNonRelevant = false;
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
    }

    this.returnExecutionHistory.emit(finalExecution);
  }

  private returnEndPointContents(content: string, startToken: string, endToken: string): string {
    let contents: string;
    let templateSearchIndexPosition = 0;
    while (true) {
         const contentStartPosition = content.indexOf(startToken, templateSearchIndexPosition);
         const contentEndPosition  = content.indexOf(endToken, templateSearchIndexPosition);

         if (contentStartPosition >= 0  && contentEndPosition >= 0) {
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
  private parseXml(endPointId: string, endpointContent: string): any {
    const templateIds: string[] = [];
    let canInsertText: boolean;
    let isSectionIf: boolean;
    let selectedElements: Map<string, any>;
    let executeSectionIfNot: boolean;
    let hasSectionNot: boolean;
    let insertValue: boolean;
    let executeTemplate: boolean;
    let isImpression: boolean;
    let isNewTemplate: boolean;
    let hasInsertPartial: boolean;
    let isMainText: boolean;
    const allReportText: AllReportText[] = [];
    const endpoints = this.Endpoints;
    let templatePartialsText: string [];
    let selectedComparisonValues: string [];
    let findingsText: string;
    let impressionText: string;
    let selectedSection: string;
    let selectedChoiceTexts: Map<string, any>;
    selectedElements = this.simulatorEngineService.getAllDataElementValues();
    templatePartialsText = this.templatePartial;
    selectedComparisonValues = this.comparisonValues;
    selectedChoiceTexts = this.simulatorEngineService.getAllDataElementTexts();
    executeSectionIfNot = false;
    hasInsertPartial = false;

    findingsText = '';
      impressionText = '';
      let isReportText: boolean;
      let reportTextContent = '';
      const endpointSax = require('sax'),
      strict = true,
      normalize = true, // set to false for html-mode
      trim = true,
      reportTextParser = endpointSax.parser(strict, trim);
      reportTextParser.onerror = function (e) {
        // an error happened.
        reportTextParser.resume();
      };
      reportTextParser.ontext = function (t) {
        if (t.length > 1) {
           t = t.trim();
        }
        let isTextInserted: boolean;
        isTextInserted = false;
        if (executeTemplate) {
          if (!isImpression) {
            if (canInsertText && hasSectionNot && hasSectionNot !== undefined && executeSectionIfNot) {
              findingsText = findingsText + t;
            } else if (canInsertText && isNewTemplate && hasInsertPartial && !isSectionIf) {
              findingsText = findingsText + t;
            } else if (canInsertText  && !isImpression ) {
              findingsText = findingsText + t;
            }
          } else {
            if (canInsertText && hasSectionNot && hasSectionNot !== undefined && executeSectionIfNot) {
              impressionText = impressionText + t;
            } else if (canInsertText && !hasSectionNot && isImpression) {
                impressionText = impressionText + t;
              } else if (canInsertText  && isNewTemplate) {
                  impressionText = impressionText + t;
                }
          }

          if (isReportText && !isTextInserted && isMainText && canInsertText) {
            reportTextContent = reportTextContent + t;
          }
        }
      };
      reportTextParser.onopentag = function (node) {
        switch (node.name) {
          case 'Label':
            canInsertText = false;
            isReportText = false;
            isMainText = false;
            break;

          case 'ReportText' :
            if (executeTemplate) {
              isReportText = true;
              canInsertText = true;
              selectedSection = node.attributes.SectionId;
              impressionText = '';
              if (node.attributes.SectionId === 'findings' && executeTemplate) {
                isImpression = false;
              } else if (node.attributes.SectionId === 'impression' && executeTemplate) {
                isImpression = true;
              }
            }
              isSectionIf = false;
              // isMainText = true;
              break;

          case 'InsertPartial' :
             if (executeTemplate) {
                generatePartialView(node.attributes.PartialId, isImpression);
                executeTemplate = true;
                canInsertText = true;
                if (isReportText) {
                  hasInsertPartial = true;
                } else {
                  hasInsertPartial = false;
                }
              } else {
                canInsertText = false;
              }
              isReportText = false;
            isMainText = false;
            break;

          case 'SectionIfValueNot':
            if (executeTemplate) {
              if (Array.isArray(selectedElements[node.attributes.DataElementId])) {
                for (const comaprisonValue of selectedElements[node.attributes.DataElementId]) {
                  if (comaprisonValue !== node.attributes.ComparisonValue &&
                    comaprisonValue !== undefined && !isSectionIf) {
                      canInsertText = true;
                      executeSectionIfNot = true;
                      break;
                  } else {
                    canInsertText = false;
                    executeSectionIfNot = false;
                  }
                }
              } else if (selectedElements[node.attributes.DataElementId] !== node.attributes.ComparisonValue &&
                  selectedElements[node.attributes.DataElementId] !== '--Select--' &&
                  selectedElements[node.attributes.DataElementId] !== undefined  &&
                  selectedElements[node.attributes.DataElementId] !== null) {
                canInsertText = true;
                executeSectionIfNot = true;
              } else {
                canInsertText = false;
                executeSectionIfNot = false;
              }
            }
            hasSectionNot = true;
            isMainText = false;
            break;
          case 'SectionIf':
            if ( selectedElements[node.attributes.DataElementId] !== undefined && selectedElements[node.attributes.DataElementId].length > 0 && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
              isSectionIf = true;
              canInsertText = true;
            } else {
              isSectionIf = false;
              canInsertText = false;
            }
            break;
          case 'SectionIfValue':
            if (executeTemplate) {
              if (executeTemplate) {
                if (Array.isArray(selectedElements[node.attributes.DataElementId])) {
                  for (const comaprisonValue of selectedElements[node.attributes.DataElementId]) {
                    if (comaprisonValue === node.attributes.ComparisonValue &&
                      comaprisonValue !== undefined) {
                        isSectionIf = true;
                        if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                          findingsText = findingsText + selectedChoiceTexts[node.attributes.DataElementId];
                        }
                      canInsertText = true;
                      break;
                    } else {
                      isSectionIf = false;
                      canInsertText = false;
                        }
                  }
                } else if (selectedElements[node.attributes.DataElementId] === node.attributes.ComparisonValue &&
                      selectedElements[node.attributes.DataElementId] !== undefined) {
                      isSectionIf = true;
                      if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                        findingsText = findingsText + selectedChoiceTexts[node.attributes.DataElementId];
                      }
                      canInsertText = true;
                    } else {
                        canInsertText = false;
                      }
              }
              break;
              }
              isMainText = false;
            break;
          case 'InsertValue':
            if (executeTemplate) {
              isReportText = false;
              insertValue = true;
              const choiceText = selectedChoiceTexts[node.attributes.DataElementId];
              if (node.attributes.Id === 'findings' || canInsertText) {
                if (selectedElements[node.attributes.DataElementId] !== undefined && hasSectionNot && executeSectionIfNot) {
                  if (isImpression) {
                    if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                      impressionText = impressionText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                    } else {
                      impressionText = impressionText + (Array.isArray(selectedElements[node.attributes.DataElementId]) ? selectedElements[node.attributes.DataElementId].join(', ') : selectedElements[node.attributes.DataElementId]);
                    }
                  } else {
                    if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                      findingsText = findingsText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                    } else {
                      findingsText = findingsText + (Array.isArray(selectedElements[node.attributes.DataElementId]) ? selectedElements[node.attributes.DataElementId].join(', ') : selectedElements[node.attributes.DataElementId]);
                    }
                  }
                } else if (selectedElements[node.attributes.DataElementId] !== undefined && !hasSectionNot) {
                  if (isImpression) {
                    if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                      impressionText = impressionText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                    } else {
                      impressionText = impressionText + (Array.isArray(selectedElements[node.attributes.DataElementId]) ? selectedElements[node.attributes.DataElementId].join(', ') : selectedElements[node.attributes.DataElementId]);
                    }
                  } else {
                    if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                      findingsText = findingsText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                    } else {
                      findingsText = findingsText + (Array.isArray(selectedElements[node.attributes.DataElementId]) ? selectedElements[node.attributes.DataElementId].join(', ') : selectedElements[node.attributes.DataElementId]);
                    }
                  }
                }
                if (isImpression) {
                  canInsertText = true;
                }
              }
            isMainText = false;
            break;
            }
        }
        executeTemplate = true;
        isNewTemplate = true;
      };
      reportTextParser.onclosetag = function(node) {
        switch (node) {
          case 'SectionIfValueNot':
            executeSectionIfNot = false;
            hasSectionNot = false;
            if (isSectionIf) {
              canInsertText = true;
            }
            break;
          case 'TemplatePartial':
            isNewTemplate = false;
            canInsertText = false;
            executeTemplate = false;
            break;
          case 'ReportText':
            // isImpression = false;
            if (!hasInsertPartial && !isImpression) {
              const reportTextObj: AllReportText = new AllReportText();
              reportTextObj.sectionId = 'findings';
              reportTextObj.reportText = findingsText;
              allReportText[reportTextObj.sectionId] = reportTextObj;
            }

            if (impressionText !== '' && impressionText !== undefined) {
              const reportTextObj: AllReportText = new AllReportText();
              reportTextObj.sectionId = selectedSection;
              reportTextObj.reportText = impressionText;
              allReportText[reportTextObj.sectionId] = reportTextObj;
              }
            hasInsertPartial = false;
            break;
          case 'SectionIf':
            isSectionIf = false;
            canInsertText = true;
            break;
          case 'InsertPartial':
            canInsertText = true;
            break;
          case 'InsertValue':
            if ((hasSectionNot && executeSectionIfNot || !hasSectionNot)) {
              canInsertText = true;
            }
            break;
          case 'SectionIfValue':
            canInsertText = true;
            break;
        }
      };

      reportTextParser.onend = function () {
        // parser stream is done, and ready to have more stuff written to it.
        // if (impressionText !== '' && impressionText !== undefined) {
        // const reportTextObj: AllReportText = new AllReportText();
        // reportTextObj.sectionId = selectedSection;
        // reportTextObj.reportText = impressionText;
        // allReportText[reportTextObj.sectionId] = reportTextObj;
        // }
       };

      reportTextParser.write(endpointContent).onend();

      function generatePartialView(partialViewId: string, isImpressionTemplate: boolean) {
        // this.templateIds = [];
        const sax = require('sax'),
        parser = sax.parser(strict, trim);
        parser.onerror = function (e) {
          // an error happened.
          // parser.resume();
        };
        parser.ontext = function (t) {
          if (executeTemplate) {
            if (!isImpressionTemplate) {
              if (canInsertText && hasSectionNot && hasSectionNot !== undefined && executeSectionIfNot) {
                findingsText = findingsText + t;
              } else if (canInsertText && !hasSectionNot && isImpression) {
                findingsText = findingsText + t;
              } else if (canInsertText  && isNewTemplate) {
                findingsText = findingsText + t;
              }
            } else {
              if (canInsertText && hasSectionNot && hasSectionNot !== undefined && executeSectionIfNot) {
                impressionText = impressionText + t;
                } else if (canInsertText && !hasSectionNot && isImpression) {
                  impressionText = impressionText + t;
                } else if (canInsertText  && isNewTemplate) {
                  impressionText = impressionText + t;
                }
            }
          }
        };
        parser.onopentag = function (node) {
          switch (node.name) {
            case 'Label': canInsertText = false;
                          break;
            case 'EndPoint' : if (node.attributes.Id !== '') {
                                  canInsertText = true;
                                  isImpression = true;
                              } else {
                                canInsertText = false;
                                isImpression = false;
                              }
                              break;
            case 'InsertPartial' : canInsertText = false;
                              break;
            case 'ReportText' : canInsertText = true;
                                break;
            case 'TemplatePartial':   hasSectionNot = false;
                                      executeSectionIfNot = false;
                                      if (node.attributes.Id === partialViewId) {
                                        executeTemplate = true;
                                        canInsertText = true;
                                        isNewTemplate = true;
                                          break;
                                        } else {
                                        isNewTemplate = false;
                                        executeTemplate = false;
                                      }

                                  break;
          case 'SectionIfValueNot':  if (executeTemplate) {
                                      if (Array.isArray(selectedElements[node.attributes.DataElementId])) {
                                        for (const comaprisonValue of selectedComparisonValues[node.attributes.DataElementId + 'ComparisonValue']) {
                                          if (comaprisonValue !== node.attributes.ComparisonValue &&
                                            comaprisonValue !== undefined && !isSectionIf) {
                                              canInsertText = true;
                                              executeSectionIfNot = true;
                                              break;
                                          } else {
                                            canInsertText = false;
                                            executeSectionIfNot = false;
                                          }
                                        }
                                      } else if (selectedElements[node.attributes.DataElementId] !== node.attributes.ComparisonValue &&
                                          selectedElements[node.attributes.DataElementId] !== '--Select--' &&
                                          selectedElements[node.attributes.DataElementId] !== undefined  &&
                                          selectedElements[node.attributes.DataElementId] !== null) {
                                        canInsertText = true;
                                        executeSectionIfNot = true;
                                      } else {
                                        canInsertText = false;
                                        executeSectionIfNot = false;
                                      }
                                    }
                                    hasSectionNot = true;

                                    break;
            case 'SectionIf':
                              if ( selectedElements[node.attributes.DataElementId] !== undefined && selectedElements[node.attributes.DataElementId].length > 0 && (!hasSectionNot || (hasSectionNot && executeSectionIfNot))
                                && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                                isSectionIf = true;
                                canInsertText = true;
                              } else {
                                isSectionIf = false;
                                canInsertText = false;
                              }
                              break;
              case 'SectionIfValue':
                                    if (executeTemplate) {
                                      if (Array.isArray(selectedElements[node.attributes.DataElementId])) {
                                        for (const comaprisonValue of selectedComparisonValues[node.attributes.DataElementId + 'ComparisonValue']) {
                                          if (comaprisonValue === node.attributes.ComparisonValue &&
                                            comaprisonValue !== undefined) {
                                              isSectionIf = true;
                                              if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                                                findingsText = findingsText + selectedChoiceTexts[node.attributes.DataElementId];
                                              }
                                            canInsertText = true;
                                            break;
                                          } else {
                                            isSectionIf = false;
                                            canInsertText = false;
                                              }
                                        }
                                      } else if (selectedElements[node.attributes.DataElementId] === node.attributes.ComparisonValue &&
                                            selectedElements[node.attributes.DataElementId] !== undefined) {
                                            isSectionIf = true;
                                            if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                                              findingsText = findingsText + selectedChoiceTexts[node.attributes.DataElementId];
                                            }
                                            canInsertText = true;
                                          } else {
                                              canInsertText = false;
                                            }
                                    }
                                    break;
            case 'InsertValue':
                                if (executeTemplate) {
                                  insertValue = true;
                                  const choiceText = selectedChoiceTexts[node.attributes.DataElementId];
                                  if (node.attributes.Id === 'findings' || canInsertText) {
                                    if (isImpression) {
                                      canInsertText = true;
                                      if (selectedElements[node.attributes.DataElementId] !== undefined && hasSectionNot && executeSectionIfNot && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                                        if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined ) {
                                          impressionText = impressionText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                                        } else {
                                          impressionText = impressionText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                                        }
                                      } else if (selectedElements[node.attributes.DataElementId] !== undefined && !hasSectionNot && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                                        if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined) {
                                          impressionText = impressionText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                                        } else {
                                          if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                                            impressionText = impressionText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                                          }
                                        }
                                      }
                                    } else {
                                      if (selectedElements[node.attributes.DataElementId] !== undefined && hasSectionNot && executeSectionIfNot && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                                        if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined) {
                                          findingsText = findingsText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                                        }
                                      } else if (selectedElements[node.attributes.DataElementId] !== undefined && !hasSectionNot && selectedChoiceTexts[node.attributes.DataElementId] !== 'Other, please specify…') {
                                        if (selectedChoiceTexts[node.attributes.DataElementId] !== undefined) {
                                          findingsText = findingsText + (Array.isArray(choiceText) ? choiceText.join(', ') : choiceText);
                                        }
                                      }
                                    }
                                  }
                                  break;
                                }
          }
        };
        parser.onclosetag = function(node) {
          switch (node) {
            case 'SectionIfValueNot':
              executeSectionIfNot = false;
              hasSectionNot = false;
              if (isSectionIf) {
                canInsertText = true;
              }
              break;
            case 'TemplatePartial':
              isNewTemplate = true;
              canInsertText = false;
              executeTemplate = true;
              break;
            case 'InsertPartial':
              canInsertText = true;
              break;
            case 'SectionIf' || 'SectionIfValue':
              isSectionIf = false;
              break;
          }
        };

        parser.onend = function () {
          // parser stream is done, and ready to have more stuff written to it.
          const reportTextObj: AllReportText = new AllReportText();
          reportTextObj.sectionId = 'findings';
          reportTextObj.reportText = findingsText;
          allReportText[reportTextObj.sectionId] = reportTextObj;
        };
      parser.write(templatePartialsText).onend();

      }
      this.mainReportTextObj = new MainReportText();
      this.mainReportTextObj.reportTextMainContent = reportTextContent;
      this.mainReportTextObj.allReportText = allReportText;
      this.returnReportText.emit(this.mainReportTextObj);
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

export class MultiChoiceElement {
  elementId: string;
  selectedValues: string [];
  selectedComparisonValues: string [];
}

export class AllElements {
  elementId: string;
  selectedValues: any [];
}

export class MainReportText {
  reportTextMainContent: string;
  allReportText: AllReportText[];
}
export class AllReportText {
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
}
