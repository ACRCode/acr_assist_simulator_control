import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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


@Component({
  selector: 'acr-assist-data-element',
  templateUrl: './assist-data-element.component.html',
  styleUrls: ['../../../modules/styles.css']
})
export class AssistDataElementComponent implements OnChanges {
  @Input() dataElements: BaseDataElement[];
  @Input() imagePath: string;
  @Input() keyDiagrams: ImageElements[];
  @Input() Endpoints = [];
  @Input() templatePartial: string[];
  @Input() Rules: Rules;
  @Input() endPointXMLString: string [] ;
  @Output() returnReportText: EventEmitter<MainReportText> = new EventEmitter<MainReportText>();


  constructor (private simulatorEngineService: SimulatorEngineService) {

  }

  mainReportTextObj: MainReportText;
  ngOnChanges(changes: SimpleChanges): void {
    this.dataElements = this.dataElements.filter(x => x.displaySequence != null).sort(function (DE_1, DE_2) { return DE_1.displaySequence - DE_2.displaySequence; });
  }

  choiceSelected(receivedChoiceElement: ChoiceElement) {
    const selectedChoiceElement = new ChoiceElement();
    this.simulatorEngineService.addOrUpdateDataElementValue(receivedChoiceElement.elementId , receivedChoiceElement.selectedValue);

  }

  numericSelected(receivedChoiceElement: NumericElement) {
    const selectedChoiceElement = new ChoiceElement();
    this.simulatorEngineService.addOrUpdateDataElementValue(receivedChoiceElement.elementId, receivedChoiceElement.selectedValue);
  }

  multiSelected(receivedElement: MultiChoiceElement) {
    const selectedChoiceElement = new ChoiceElement();
    this.simulatorEngineService.addOrUpdateDataElementValue(receivedElement.elementId, receivedElement.selectedValues);
  }

  generateReportText(endpointId: string) {
    this.parseXml('LR1');
  }

  private parseXml(EndPOintId: string): any {
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
    executeSectionIfNot = false;
    const allReportText: AllReportText[] = [];

    let findingsText: string;
    let impressionText: string;
    selectedElements = this.simulatorEngineService.getAllDataElementValues();
    for (const endpoint of this.Endpoints) {
      if (endpoint.Attr.Id === EndPOintId) {
        if (Array.isArray(endpoint.ReportTexts.ReportText)) {
          for (const reportText of endpoint.ReportTexts.ReportText) {
            if (Array.isArray (reportText.InsertPartial) && reportText.InsertPartial !== undefined ) {
              for (const insPartial of reportText.InsertPartial) {
                templateIds.push(insPartial.Attr.PartialId);
              }
          } else if (reportText.InsertPartial !== undefined ) {
            templateIds.push(reportText.InsertPartial.Attr.PartialId);
          }
          }
        } else {
          templateIds.push(endpoint.ReportTexts.ReportText.InsertPartial.Attr.PartialId);
        }
      }
    }

    findingsText = '';
     const sax = require('../../../../../node_modules/sax/lib/sax'),
      strict = true,
      normalize = true, // set to false for html-mode
      trim = true,
      parser = sax.parser(strict, trim);
      parser.onerror = function (e) {
        // an error happened.
        parser.resume();
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
          case 'EndPoint' : if (node.attributes.Id === EndPOintId) {
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
                                    for ( const parId of templateIds) {
                                      if (parId === node.attributes.Id) {
                                      executeTemplate = true;
                                      canInsertText = true;
                                      isNewTemplate = true;
                                        break;
                                      } else {
                                      isNewTemplate = false;
                                      executeTemplate = false;
                                    }
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
                                    if (selectedElements[node.attributes.DataElementId] === node.attributes.ComparisonValue &&
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
            isNewTemplate = false;
            canInsertText = false;
            break;
        }
      };

      parser.onend = function () {
        const reportTextObj: AllReportText = new AllReportText();
        reportTextObj.sectionId = 'findings';
        reportTextObj.reportText = findingsText;
        allReportText.push(reportTextObj);
      };
      impressionText = '';
      let isReportText: boolean;
      let reportTextContent = '';
      const endpointSax = require('../../../../../node_modules/sax/lib/sax'),
      reportTextParser = sax.parser(strict, trim);
      reportTextParser.onerror = function (e) {
        reportTextParser.resume();
      };
      reportTextParser.ontext = function (t) {
        if (executeTemplate) {
         if (canInsertText && hasSectionNot && hasSectionNot !== undefined && executeSectionIfNot) {
          impressionText = impressionText + t;
          } else if (canInsertText && !hasSectionNot && isImpression) {
            impressionText = impressionText + t;
          } else if (canInsertText  && isNewTemplate) {
            impressionText = impressionText + t;
          }
          if (isReportText) {
            reportTextContent = reportTextContent + t;
          }
        }
      };
      reportTextParser.onopentag = function (node) {
        switch (node.name) {
          case 'Label': canInsertText = false;
          isReportText = false;
          break;
          case 'EndPoint' : if (node.attributes.Id === EndPOintId) {
                                canInsertText = true;
                                executeTemplate = true;
                                isImpression = true;
                            } else {
                              canInsertText = false;
                              executeTemplate = false;
                              isImpression = false;
          isReportText = false;
        }
                            break;
          case 'InsertPartial' : canInsertText = false;
          isReportText = false;
          break;
          case 'ReportText' : canInsertText = true;
                              if (node.attributes.SectionId !== 'impression' && executeTemplate) {
                                canInsertText = false;
                                isReportText = true;
                              } else {
                                isReportText = false;
                              }
                              break;
          case 'TemplatePartial':   hasSectionNot = false;
                                    executeSectionIfNot = false;
                                    for ( const parId of templateIds) {
                                      if (parId === node.attributes.Id) {
                                      executeTemplate = true;
                                      canInsertText = true;
                                      isNewTemplate = true;
                                        break;
                                      } else {
                                      isNewTemplate = false;
                                      executeTemplate = false;
                                    }
                                  }

                                  break;
          case 'SectionIfValueNot':  if (executeTemplate) {
                                        if (selectedElements[node.attributes.DataElementId] !== node.attributes.ComparisonValue &&
                                          selectedElements[node.attributes.DataElementId] !== undefined  &&
                                          selectedElements[node.attributes.DataElementId] !== null) {
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
                                    if (selectedElements[node.attributes.DataElementId] === node.attributes.ComparisonValue &&
                                      selectedElements[node.attributes.DataElementId] !== undefined) {
                                        isSectionIf = true;
                                        if (selectedElements[node.attributes.DataElementId] !== undefined && !isSectionIf) {
                                          impressionText = impressionText + ' ' + impressionText[node.attributes.DataElementId];
                                  }
                                      } else {
                                        canInsertText = false;
                                      }
                                    }

                                  break;
          case 'InsertValue':
                              if (executeTemplate) {
                                isReportText = false;
                                insertValue = true;
                                if (node.attributes.Id === 'findings' || canInsertText) {
                                  if (selectedElements[node.attributes.DataElementId] !== undefined && hasSectionNot && executeSectionIfNot) {
                                    impressionText = impressionText + ' ' + selectedElements[node.attributes.DataElementId];
                                  } else if (selectedElements[node.attributes.DataElementId] !== undefined && !hasSectionNot) {
                                    impressionText = impressionText + ' ' + selectedElements[node.attributes.DataElementId];
                                  }
                                  if (isImpression) {
                                    canInsertText = true;
                                  }
                                }
                                break;
                              }
        }
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
            break;
        }
      };

      reportTextParser.onend = function () {
        const reportTextObj: AllReportText = new AllReportText();
        reportTextObj.sectionId = 'impression';
        reportTextObj.reportText = impressionText;
        allReportText.push(reportTextObj);
      };

      parser.write(this.templatePartial).onend();
      reportTextParser.write(this.endPointXMLString).onend();
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
