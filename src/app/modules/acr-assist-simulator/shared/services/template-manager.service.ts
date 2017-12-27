import { Injectable } from '@angular/core';
declare var require: any;

@Injectable()
export class TemplateManagerService {

  constructor() { }

  parseToJson(xmlData: string): JSON {
      let jsonResult: JSON;
      const parseString =  require('xml2js').parseString;
      parseString(xmlData, {explicitRoot : false, explicitArray : false, attrkey : 'Attr'} , function (err, result) {
          jsonResult  = result;
    });
    return jsonResult;
  }
}
