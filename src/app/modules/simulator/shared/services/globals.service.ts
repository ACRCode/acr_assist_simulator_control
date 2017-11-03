import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsService {

  public ExecutedConditionsIndexes = {};
  public ComputedElementConditions = {};
  public SelectedXMLFile: string;
  public XMLAcronyms = {};
  public ExecutedConditions = {};
  public LoadkeyDiagram = true;

}
