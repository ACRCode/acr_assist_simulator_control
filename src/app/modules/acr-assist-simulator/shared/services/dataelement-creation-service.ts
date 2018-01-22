import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';

export interface DataElementCreationService {
    elementType: string;
    createElement(data: any): BaseDataElement;
}
