import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class UrlHelperService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getImageData(url: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let objectUrl: string = null;

      this.http.get(url, { responseType: 'blob' }).subscribe(
        m => {
          objectUrl = URL.createObjectURL(m);
          observer.next(objectUrl);
        });

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
    });
  }
}
