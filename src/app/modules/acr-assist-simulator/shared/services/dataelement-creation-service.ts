import { BaseDataElement } from 'testruleengine/Library/RuleEvaluator';

export interface DataElementCreationService {
    elementType: string;
    createElement(data: any): BaseDataElement;
}
