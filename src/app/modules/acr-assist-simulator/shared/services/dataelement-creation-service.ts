import { BaseDataElement } from 'testruleengine/Library/Models/Class';

export interface DataElementCreationService {
    elementType: string;
    createElement(data: any): BaseDataElement;
}
