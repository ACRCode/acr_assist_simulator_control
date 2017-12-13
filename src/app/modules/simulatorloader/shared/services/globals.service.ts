import { Injectable } from '@angular/core';
import { FileDetails } from '../models/file-details.model';
import { Dictionary } from '../models/dictionary';
@Injectable()
export class GlobalsService {

  public XMLList: Dictionary<FileDetails> = new Dictionary<FileDetails>();

}
