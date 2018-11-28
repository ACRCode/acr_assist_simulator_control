import { Injectable , Inject  } from '@angular/core';
import {Template} from '../../../core/models/template.model';
import { Metadata } from '../../../core/metadata/models/metadata-model';
import { Diagram } from '../../../core/models/diagram.model';
import { DiagramService } from './diagram.service';
import { CreationServiceInjectorToken } from '../../constants';
import {DataElementCreationBaseService} from './data-element-creation-base-service';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';
import { ArrayCheckerService } from './array-checker.service';
import { DecisionPointsCreationService } from './decision-points-creation.service';
import { Rules } from '../../../core/rules/models/rules.model';
import { fail } from 'assert';
import { TemplatePartial } from '../../../core/endpoint/template-partial';
import { SectionIfValueNotCondition } from '../../../core/endpoint/section-if-value-not-condition';
import { SectionIfValueCondition } from '../../../core/endpoint/section-if-value-condition';
declare var require: any;


@Injectable()
export class TemplateManagerService {
  private endPointXMLString: string[] = [];

  private stringParser: any = require('string');

  constructor(private  diagramService: DiagramService ,
    @Inject(CreationServiceInjectorToken) private elememtcreationService: DataElementCreationBaseService[] ,
    private arrayCheckerService: ArrayCheckerService , private decisionPointsCreationService: DecisionPointsCreationService) { }

  getTemplate(templateContent: string): Template  {
   const template = new Template();
   let templateContentAsJSON: any;
   templateContentAsJSON = this.parseToJson(templateContent);
   if (template === undefined) {
    throw  new Error('Unable to parse the template');
   }
   template.metadata = this.getMetaData(templateContentAsJSON.Metadata);
   template.dataElements = this.getDataElements(templateContentAsJSON.DataElements);
   if (templateContentAsJSON.Rules) {
    template.rules  = new Rules();
    template.rules.decisionPoints = this.decisionPointsCreationService.
                          createDecisionPoints(templateContentAsJSON.Rules.DecisionPoint);
  }
    template.templatePartial = this.returnEndpoints(templateContent);
    template.endPointsString = this.endPointXMLString;
    template.xmlContent = templateContent;

// console.log(template.templatePartial);
//console.log(template.endPointsString);

    return template;

  }

  private getTemplatePartial(templatePartialJSON: any): TemplatePartial {
    const templatePartial = new TemplatePartial;
    templatePartial.id = templatePartialJSON.Attr.Id;
    templatePartial.sectionIfNotValue = templatePartialJSON.SectionIfValueNot;
    templatePartial.sectionIfValues = templatePartialJSON.SectionIfValue;
    return templatePartial;
  }

  private returnEndPointContents(content: string, startToken: string, endToken: string): string[] {
    const contents = new Array<string>();
    let templateSearchIndexPosition = 0;
    while (true) {
         const contentStartPosition = content.indexOf(startToken, templateSearchIndexPosition);
         const contentEndPosition  = content.indexOf(endToken, templateSearchIndexPosition);

         if (contentStartPosition >= 0  && contentEndPosition >= 0) {
            const endPosition = contentEndPosition + endToken.length;
            const contentData = content.substring(contentStartPosition, endPosition);
            contents.push(contentData);
            templateSearchIndexPosition = endPosition + 1;
         } else {
            break;
         }
    }
    
    return contents;
  }

private returnTemplatePartials(templatePartialArray: string[]): TemplatePartial[] {
      const templatePartials = new Array<TemplatePartial>();
      for (const arrayItem of templatePartialArray) {
        const templatePartial = new TemplatePartial();
        const templatePartialAsJSON = this.parseToJson(arrayItem);
        templatePartial.id = templatePartialAsJSON.Attr.Id;

      }

      return templatePartials;
}

  private returnEndpoints(xmlData: string): string[] {
    const endPointStartToken = '<EndPoints>';
    const endPointEndToken = '</EndPoints>';

    const endPointStartTokenPosition = xmlData.indexOf(endPointStartToken);
    const endPointEndTokenPosition = xmlData.indexOf(endPointEndToken);
    if (endPointStartTokenPosition >= 0  && endPointEndTokenPosition >= 0 ) {
      const contentStartPosition =  (endPointStartTokenPosition + endPointStartToken.length);
      const endPointContent = xmlData.substring(contentStartPosition , endPointEndTokenPosition);
    if (endPointContent.length > 0 ) {
            const templatePartials = this.returnEndPointContents(endPointContent, '<TemplatePartial' , '</TemplatePartial>');
            this.endPointXMLString = this.returnEndPointContents(endPointContent, '<EndPoint' , '</EndPoint>');
    return templatePartials;
        }
    }
  }


private parseToJson(xmlData: string): any {
    let jsonResult: JSON;
    const parseString =  require('xml2js').parseString;
    parseString(xmlData, {explicitRoot : false, explicitArray : false, attrkey : 'Attr'} , function (err, result) {
        jsonResult  = result;
  });
  return jsonResult;
 }

 private getMetaData(metadataJSON: any): Metadata {
    const metadata = new Metadata();
    metadata.label = metadataJSON.Label;
    metadata.id = metadataJSON.ID;
    metadata.schemaVersion = metadataJSON.SchemaVersion;
    metadata.ruleVersion = metadataJSON.RuleVersion;
    const diagramsAsJSON = metadataJSON.Info.Diagrams.Diagram;
    metadata.diagrams = this.diagramService.returnDiagrams(diagramsAsJSON);

    metadata.approvedBy = metadataJSON.ApprovedBy;
    metadata.createdDate = metadataJSON.CreatedDate;
    metadata.lastModifiedDate = metadataJSON.LastModifiedDate;
    metadata.reviewedBy = metadataJSON.ReviewedBy;
    metadata.developedBy = metadataJSON.DevelopedBy;

    return metadata;
 }



 private  returnDataElement (elementType: string, dataElementsJSON: any): BaseDataElement[] {
    const  dataElements = new Array<BaseDataElement>();
    let dataElementCreationServiceInstance: DataElementCreationBaseService;
    for (const dataElementCreationService of this.elememtcreationService) {
          if (dataElementCreationService.elementType === elementType) {
            dataElementCreationServiceInstance = dataElementCreationService;
            break;
          }
    }

    if (dataElementCreationServiceInstance !== undefined && dataElementsJSON !== undefined)  {
       if (this.arrayCheckerService.isArray(dataElementsJSON)) {
        for (const dataElementJSON of dataElementsJSON) {
            const dataElement = dataElementCreationServiceInstance.createElement(dataElementJSON);
            dataElements.push(dataElement);
        }
      } else {
        const dataElement = dataElementCreationServiceInstance.createElement(dataElementsJSON);
        dataElements.push(dataElement);
      }
    }
    return dataElements;
 }

 private getDataElements(dataElementsJSON: any): BaseDataElement[] {
   let  dataElements = new Array<BaseDataElement>();
   dataElements = dataElements.concat(this.returnDataElement('ChoiceDataElement', dataElementsJSON.ChoiceDataElement));
   dataElements = dataElements.concat(this.returnDataElement('MultiChoiceDataElement', dataElementsJSON.MultiChoiceDataElement));
   dataElements = dataElements.concat(this.returnDataElement('NumericDataElement', dataElementsJSON.NumericDataElement));
   dataElements = dataElements.concat(this.returnDataElement('GlobalValue', dataElementsJSON.GlobalValue));
   dataElements = dataElements.concat(this.returnDataElement('ComputedDataElement', dataElementsJSON.ComputedDataElement));
   dataElements = dataElements.concat(this.returnDataElement('IntegerDataElement', dataElementsJSON.IntegerDataElement));
   dataElements = dataElements.concat(this.returnDataElement('DateTimeDataElement', dataElementsJSON.DateTimeDataElement));
   dataElements = dataElements.concat(this.returnDataElement('DurationDataElement', dataElementsJSON.DurationDataElement));
   return dataElements;
 }
}
