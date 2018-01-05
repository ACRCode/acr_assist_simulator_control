import { Injectable } from '@angular/core';

@Injectable()
export class ArrayCheckerService {

  constructor() { }

  isArray(item: any): boolean {
    return Object.prototype.toString.call(item) === '[object Array]';
  }

}
