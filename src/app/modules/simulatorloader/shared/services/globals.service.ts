import { Injectable } from '@angular/core';
import { FileDetails } from '../models/file-details.model';
import { Dictionary } from '../models/dictionary';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GlobalsService {

  defaultCovidModule = 'assets/XMLFIles/Covid/Covid-19_ Chest CT.xml';
  defaultModule =  'assets/XMLFIles/hello_assist/Hello_Assist.xml';
  defaultTestModule = 'assets/XMLFIles/test_module/Test_Module.xml';

  public XMLList: Dictionary<FileDetails> = new Dictionary<FileDetails>();

  constructor(private http: HttpClient) { }

  getDefaultCovidModulePath(): Observable<string> {
    return this.http.get(this.defaultCovidModule, { responseType: 'text' });
  }

  getDefaultModulePath(): Observable<string> {
    return this.http.get(this.defaultModule, { responseType: 'text' });
  }

  getDefaultTestModulePath(): Observable<string> {
    return this.http.get(this.defaultTestModule, { responseType: 'text' });
  }
}

