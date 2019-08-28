import { Coding } from 'testruleengine/Library/Models/Class';

export class FHIRElement {
    id: string;
    type: string;
    value: string;
    unit: string;
    code: Array<Coding>;
}