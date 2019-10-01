import { Coding } from 'testruleengine/Library/Models/Class';

export class FHIRValue {
    id: string;
    value: any;
    type: string;
    unit: string;
    code: Array<Coding>;

    constructor() {        
        this.code = new Array<Coding>();
    }
}