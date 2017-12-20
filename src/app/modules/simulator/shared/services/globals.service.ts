import { Injectable } from '@angular/core';
import { ExecutedResults } from '../models/executed-results.model';

@Injectable()
export class GlobalsService {

  public ExecutedConditionsIndexes = {};
  public ExecutedConditions : {};
  public ComputedElementConditions = {};
  public XMLAcronyms = {};
  public LoadkeyDiagram = true;
  public evaluateExpessions = true;
  public expressionResults : ExecutedResults;

  constructor(){
    this.expressionResults=new ExecutedResults();
  }
 }
