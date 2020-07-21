import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  isValidInstance(data: any) {
    return (data !== undefined && data !== null);
  }

  isNotEmptyArray(data: any[]) {
    let isValid = this.isValidInstance(data);
    if (isValid) {
      isValid = data.length > 0;
    }
    return isValid;
  }

  isNotEmptyString(data: any) {
    let isValid = this.isValidInstance(data);
    if (isValid) {
      isValid = data.toString().trim().length > 0;
    }
    return isValid;
  }

  isValidImageURL(value: string) {
    if (typeof value !== 'string') {
      return false;
    }
    return !!value.match(/^((http|https):\/\/)/) && !!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
  }

  isNotEmptyGuid(data: any) {
    const emptyGuid = '00000000-0000-0000-0000-000000000000';
    return data !== emptyGuid;
  }

  isImageDataUrl(data: string) {
    // tslint:disable-next-line:max-line-length
    const isDataURL = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    return !! data.match(isDataURL);
  }

  isValidUrl(data: string) {
    // tslint:disable-next-line:max-line-length
    const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return !! data.match(urlRegex);
  }

  formatDateTime(data: string) {
    const isValid = this.isNotEmptyString(data);
    if (isValid) {
      const localDateTime = new Date(data);
      return localDateTime.toLocaleString();
    }
    return data;
  }

  trimWhiteSpaces(data: string): string {
    const isValid = this.isNotEmptyString(data);
    if (isValid) {
      const trimmedData = data.replace(/\s/g, '');
      return trimmedData;
    }
    return data;
  }

  trimAndRemoveSpecialChars(data: string): string {
    const isValid = this.isNotEmptyString(data);
    if (isValid) {
      const trimmedData = data.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=��?;:'",.<>\{\}\[\]\\\/]/gi, '');
      return trimmedData;
    }
    return data;
  }

  textifyData(data: string): string {
    const isValid = this.isNotEmptyString(data);
    if (isValid) {
      const textifiedData = data.replace(/&nbsp;/g, ' ').replace(/\r?\n|\r/g, ' ').replace(/\t/g, '').
                                 replace(/\s\s+/g, ' ').replace(/<br>/g, '\n');
      return textifiedData;
    }
    return data;
  }
}
