import { ExpressionBlock } from './expression-block.model';
import { EndPoint } from './endpoint.model';
import { DataElement } from './data-element.model';

export class ExecutedResults {
  public formData = {};

  public reportSections = {};

  public block = {};

  constructor ( ) {
    this.formData = {};
    this.reportSections = {};
    this.block  = {};
  }

}
