import { Injectable } from '@angular/core';
import { FileDetails } from '../models/file-details.model';
import { Dictionary } from '../models/dictionary';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GlobalsService {

  defaultModule =  'assets/XMLFiles/Hello_Assist/Hello_Assist.xml';
  defaultTestModule = 'assets/XMLFiles/Test_Module/Test_Module.xml';

  public XMLList: Dictionary<FileDetails> = new Dictionary<FileDetails>();

  constructor(private http: HttpClient) { }

  getDefaultModulePath(): Observable<string> {
    return this.http.get(this.defaultModule, { responseType: 'text' });
  }

  getDefaultTestModulePath(): Observable<string> {
    return this.http.get(this.defaultTestModule, { responseType: 'text' });
  }
}

