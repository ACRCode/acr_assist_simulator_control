import { Injectable } from '@angular/core';

@Injectable()
export class StringUtilityService {

  isEmpty(str: string) {
    return str === '';
  }

  cleanText(text: string) {
    return text.replace(/ /g, '');
  }

}
