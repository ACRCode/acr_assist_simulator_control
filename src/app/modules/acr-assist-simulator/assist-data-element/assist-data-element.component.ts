import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { DataElement } from '../../simulator/shared/models/data-element.model';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import {Template} from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';
import { EndPoint } from '../../simulator/shared/models/endpoint.model';
import { EndPointRef } from '../../core/models/endpointref.model';
import { Rules } from '../../core/rules/models/rules.model';
import { SectionIfValueNotCondition } from '../../core/endpoint/section-if-value-not-condition';
import { SectionIfValueCondition } from '../../core/endpoint/section-if-value-condition';
import { TemplatePartial } from '../../core/endpoint/template-partial';
import { Console } from '@angular/core/src/console';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { SimulatorState } from '../../core/models/simulator-state.model';


@Component({
  selector: 'acr-assist-data-element',
  templateUrl: './assist-data-element.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AssistDataElementComponent implements OnInit, OnChanges {

  @Input() dataElements: BaseDataElement[];
  @Input() imagePath: string;
  @Input() keyDiagrams: ImageElements[];
  @Input() Endpoints = [];
  @Input() templatePartial: string[];
  @Input() Rules: Rules;
  @Input() endPointXMLString: string [];
  @Input() xmlContent: string;
  @Output() returnReportText: EventEmitter<MainReportText> = new EventEmitter<MainReportText>();
  mainReportTextObj: MainReportText;
  simulatorState: SimulatorState;
  dataElementValues: Map<string, any>;

  constructor (private simulatorEngineService: SimulatorEngineService) {

  }


  ngOnInit(): void {
    this.simulatorEngineService.simulatorStateChanged.subscribe((message) => {

      this.simulatorState =  message as  SimulatorState;
        console.log(this.simulatorState);
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
        dataElement.currentValue = this.dataElementValues[dataElement.id];
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

  choiceSelected(receivedElement: ChoiceElement) {
       this.simulatorEngineService.addOrUpdateDataElementValue(receivedElement.elementId , receivedElement.selectedValue);
  }

  numericSelected(receivedElement: NumericElement) {

     this.simulatorEngineService.addOrUpdateDataElementValue(receivedElement.elementId, receivedElement.selectedValue);
  }

  multiSelected(receivedElement: MultiChoiceElement) {
      this.simulatorEngineService.addOrUpdateDataElementValue(receivedElement.elementId, receivedElement.selectedValues);
  }

  generateReportText(endpointId: string) {
    const endpointContent = this.returnEndPointContents(this.xmlContent, '<EndPoint Id="' + endpointId + '">' , '</EndPoint>');
    this.parseXml(endpointId, endpointContent);
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
    let findingsText: string;
    let impressionText: string;
    selectedElements = this.simulatorEngineService.getAllDataElementValues();
    templatePartialsText = this.templatePartial;
    executeSectionIfNot = false;
    hasInsertPartial = false;

    findingsText = '';
      impressionText = '';
      let isReportText: boolean;
       // selectedElements = this.allElements;
        let reportTextContent = '';
      const endpointSax = require('../../../../../node_modules/sax/lib/sax'),
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
         if (canInsertText && hasSectionNot && hasSectionNot !== undefined && executeSectionIfNot && isImpression) {
          impressionText = impressionText + t;
          } else if (canInsertText && hasSectionNot && hasSectionNot !== undefined && executeSectionIfNot && !isImpression) {
            findingsText = findingsText + t;
            } else if (canInsertText && isNewTemplate && hasInsertPartial && !isSectionIf) {
            findingsText = findingsText + t;
            isNewTemplate = false;
          } else if (canInsertText && (!hasSectionNot || isNewTemplate) && isImpression) {
            impressionText = impressionText + t;
            isTextInserted = true;
          } else if (canInsertText  && !isImpression && !isMainText) {
            findingsText = findingsText + t;
          }

          if (isReportText && !isTextInserted && isMainText) {
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
              if (node.attributes.SectionId === 'findings' && executeTemplate) {
                isImpression = false;
              } else if (node.attributes.SectionId === 'impression' && executeTemplate) {
                isImpression = true;
              }
            }
              isSectionIf = false;
              isMainText = true;
              break;

          case 'InsertPartial' :
             if (executeTemplate) {
                generatePartialView(node.attributes.PartialId);
                // this.generatePartialView(parId);
                executeTemplate = true;
                canInsertText = true;
                // isNewTemplate = true;
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
                if (selectedElements[node.attributes.DataElementId] !== node.attributes.ComparisonValue &&
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
            if (!hasSectionNot || hasSectionNot === undefined ) {
                canInsertText = true;
              }
              isSectionIf = true;

            break;
          case 'SectionIfValue':
            if (executeTemplate) {
              if (selectedElements[node.attributes.DataElementId] === node.attributes.ComparisonValue &&
                selectedElements[node.attributes.DataElementId] !== undefined) {
                  canInsertText = true;
                  isSectionIf = true;
                  if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf) {
                    impressionText = impressionText + ' ' + selectedElements[node.attributes.DataElementId];
                  } else  if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf && !isImpression) {
                    findingsText = findingsText + ' ' + selectedElements[node.attributes.DataElementId];
                  }
                } else {
                  canInsertText = false;
                }
              }
              isMainText = false;
            break;
          case 'InsertValue':
            if (executeTemplate) {
              isReportText = false;
              insertValue = true;
              if (node.attributes.Id === 'findings' || canInsertText) {
                if (selectedElements[node.attributes.DataElementId] !== undefined && hasSectionNot && executeSectionIfNot) {
                  if (isImpression) {
                    impressionText = impressionText + ' ' + selectedElements[node.attributes.DataElementId];
                  } else {
                    findingsText = findingsText + ' ' + selectedElements[node.attributes.DataElementId];
                  }
                } else if (selectedElements[node.attributes.DataElementId] !== undefined && !hasSectionNot) {
                  if (isImpression) {
                    impressionText = impressionText + ' ' + selectedElements[node.attributes.DataElementId];
                  } else {
                    findingsText = findingsText + ' ' + selectedElements[node.attributes.DataElementId];
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
            break;
            case 'TemplatePartial':
            isNewTemplate = false;
            canInsertText = false;
            executeTemplate = false;
            break;
            case 'ReportText':
            isImpression = false;
            if (!hasInsertPartial) {
              const reportTextObj: AllReportText = new AllReportText();
              reportTextObj.sectionId = 'findings';
              reportTextObj.reportText = findingsText;
              allReportText.push(reportTextObj);
            }
            hasInsertPartial = false;
            break;
            case 'SectionIf':
              isSectionIf = false;
              break;
            case 'InsertPartial':
              canInsertText = true;
              break;

        }
      };

      reportTextParser.onend = function () {
        // parser stream is done, and ready to have more stuff written to it.
        const reportTextObj: AllReportText = new AllReportText();
        reportTextObj.sectionId = 'impression';
        reportTextObj.reportText = impressionText;
        for (let i = 0 ; i < allReportText.length; i++) {
            if (allReportText[i].sectionId === 'findings') {
              allReportText[i].reportText = findingsText;
              break;
            }
        }
        allReportText.push(reportTextObj);
       };

      reportTextParser.write(endpointContent).onend();

      function generatePartialView(partialViewId: string) {
        // this.templateIds = [];
        const sax = require('../../../../../node_modules/sax/lib/sax'),
        parser = sax.parser(strict, trim);
        parser.onerror = function (e) {
          // an error happened.
          // parser.resume();
        };
        parser.ontext = function (t) {
          if (executeTemplate) {
           if (canInsertText && hasSectionNot && hasSectionNot !== undefined && executeSectionIfNot) {
            findingsText = findingsText + t;
            } else if (canInsertText && !hasSectionNot && isImpression) {
              findingsText = findingsText + t;
            } else if (canInsertText  && isNewTemplate) {
              findingsText = findingsText + t;
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
                                        // templateIds[templateIds.indexOf(parId)] = '';

                                          break;
                                        } else {
                                        isNewTemplate = false;
                                        executeTemplate = false;
                                      }

                                  break;
          case 'SectionIfValueNot':  if (executeTemplate) {
                                        if (selectedElements[node.attributes.DataElementId] !== node.attributes.ComparisonValue &&
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
            case 'SectionIf': if (!hasSectionNot || hasSectionNot === undefined ) {
                                canInsertText = true;
                              }
                              isSectionIf = true;
                              break;
              case 'SectionIfValue':
                                    if (executeTemplate) {
                      if (Array.isArray(selectedElements[node.attributes.DataElementId])) {
                selectedElements.forEach((selectedElement, selectedValue) => {
                  if (selectedValue === node.attributes.ComparisonValue &&
                    selectedValue !== undefined) {
                      isSectionIf = true;
                      if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf) {
                        findingsText = findingsText + ' ' + selectedElements[node.attributes.DataElementId];
                      }
                    canInsertText = true;
                  } else {
                        canInsertText = false;
                      }
                });
              } else if (selectedElements[node.attributes.DataElementId] === node.attributes.ComparisonValue &&
                                        selectedElements[node.attributes.DataElementId] !== undefined) {
                                          isSectionIf = true;
                                          if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf) {
                                            findingsText = findingsText + ' ' + selectedElements[node.attributes.DataElementId];
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
                                  if (node.attributes.Id === 'findings' || canInsertText) {
                                    if (selectedElements[node.attributes.DataElementId] !== undefined && hasSectionNot && executeSectionIfNot) {
                                      findingsText = findingsText + selectedElements[node.attributes.DataElementId];
                                    } else if (selectedElements[node.attributes.DataElementId] !== undefined && !hasSectionNot) {
                                      findingsText = findingsText + ' ' + selectedElements[node.attributes.DataElementId];
                                    }
                                    if (isImpression) {
                                      canInsertText = true;
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
          allReportText.push(reportTextObj);
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
}

export class NumericElement {
  elementId: string;
  selectedValue: number;
}

export class MultiChoiceElement {
  elementId: string;
  selectedValues: string [];
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
