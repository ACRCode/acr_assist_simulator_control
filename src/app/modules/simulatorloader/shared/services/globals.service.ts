import { Injectable } from '@angular/core';
import { FileDetails } from '../models/file-details.model';
import { Dictionary } from '../models/dictionary';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GlobalsService {
  defaultModule =  'assets/XMLFIles/Hello_RADS/Hello_RADS.xml';

  public XMLList: Dictionary<FileDetails> = new Dictionary<FileDetails>();

  constructor(private http: Http) { }


  getDefaultModulePath() {
    return this.http.get(this.defaultModule).map(res => res.text());
  }
}

