import { Coding } from './coding.model';

export class CodableConcept {
    name: string;
    coding: Coding[];

    constructor() {
        this.coding = new Array<Coding>();
    }
}
