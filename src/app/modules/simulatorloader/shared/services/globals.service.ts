import { Injectable } from '@angular/core';
import { FileDetails } from '../models/file-details.model';
import { Dictionary } from '../models/dictionary';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GlobalsService {
  defaultModule =  'assets/XMLFIles/hello_assist/Hello_Assist.xml';
  defaultTestModule = 'assets/XMLFIles/test_module/Test_Module.xml';
  defaultBrainMsModule = 'assets/XMLFIles/Brain MS/Brain_MS.xml';

  public XMLList: Dictionary<FileDetails> = new Dictionary<FileDetails>();

  constructor(private http: Http) { }


  getDefaultModulePath(): Observable<string> {
    return this.http.get(this.defaultModule).map(res => res.text());
  }

  getDefaultTestModulePath(): Observable<string> {
    return this.http.get(this.defaultTestModule).map(res => res.text());
  }

  getDefaultBrainMsModulePath(): Observable<string> {
    return this.http.get(this.defaultBrainMsModule).map(res => res.text());
  }
}

