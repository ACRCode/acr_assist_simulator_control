import { Injectable } from '@angular/core';
import {Template} from '../../../core/models/template.model';
import { Metadata } from '../../../core/metadata/models/metadata-model';
import { Diagram } from '../../../core/models/diagram.model';
declare var require: any;

@Injectable()
export class TemplateManagerService {

  constructor() { }

  getTemplate(templateContent: string): Template  {
   const template = new Template();
   let templateContentAsJSON: any;
   templateContentAsJSON = this.parseToJson(templateContent);
   if (template === undefined) {
    throw  new Error('Unable to parse the template');
   }

   template.metadata = this.getMetaData(templateContentAsJSON.Metadata);
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


private  returnDiagram(diagramJSON: any ): Diagram {
  const metadataDiagram = new Diagram();
  metadataDiagram.displaySequence = diagramJSON.Attr.DisplaySequence;
  metadataDiagram.keyDiagram = diagramJSON.Attr.KeyDiagram ?  diagramJSON.Attr.KeyDiagram : false;
  metadataDiagram.label = diagramJSON.Label;
  metadataDiagram.location = diagramJSON.location;
  return metadataDiagram;
}


isArray(item: any): boolean {
  return Object.prototype.toString.call(item) === '[object Array]';
}

 private getMetaData(metadataJSON: any): Metadata {
    const metadata = new Metadata();
    metadata.label = metadataJSON.Label;
    metadata.id = metadataJSON.ID;
    metadata.schemaVersion = metadataJSON.SchemaVersion;
    metadata.ruleVersion = metadataJSON.RuleVersion;
    const diagrams = metadataJSON.Info.Diagrams.Diagram;
    if (diagrams !== undefined) {
       metadata.diagrams = new Array<Diagram>();
       if (this.isArray(diagrams)) {
        for (const diagram of diagrams) {
            metadata.diagrams.push(this.returnDiagram(diagram));
        }
       } else {
             metadata.diagrams.push(this.returnDiagram(diagrams));
       }
    }
    return metadata;
 }




}
