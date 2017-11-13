import { Metadata } from './metadata.model';
import { DataElement } from './data-element.model';
import { EndPoint } from './endpoint.model';
import { ExpressionBlock } from './expression-block.model';

export class Template {

    metadata: Metadata;
    dataElements: DataElement[];
    endpoints: EndPoint[];
    expressionBlocks: ExpressionBlock[];
    acronyms: {};
    templatePartials: {};
    formValues: {};

}
