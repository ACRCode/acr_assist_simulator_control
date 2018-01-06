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
declare var require: any;

@Injectable()
export class TemplateManagerService {

  constructor(private  diagramService: DiagramService ,
    @Inject(CreationServiceInjectorToken) private elememtcreationService: DataElementCreationBaseService[] ,
    private arrayCheckerService: ArrayCheckerService , private decisionPointsCreationService: DecisionPointsCreationService) { }

  getTemplate(templateContent: string): Template  {
   const template = new Template();
   let templateContentAsJSON: any;
   templateContentAsJSON = this.parseToJson(templateContent);
   console.log(templateContentAsJSON);
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
   return template;

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

    return metadata;
 }



 private  returnDataElement (elementType: string, dataElementsJSON: any): BaseDataElement[] {
    const  dataElements = new Array<BaseDataElement>();
    let dataElementCreationServiceInstance: DataElementCreationBaseService;
    for (const dataElementCreationService of this.elememtcreationService)
    {
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
   dataElements = dataElements.concat(this.returnDataElement('ComputedElement', dataElementsJSON.ComputedElement));
    return dataElements;
 }
}
