import { CodingValue } from './coding-value.model';

export class Coding {
    codingSystem: CodingValue;
    codingVersion: CodingValue;
    codingCode: CodingValue;
    codingDisplay: CodingValue;
    codingUserSelected: CodingValue;

    constructor() {
       this.codingSystem = new CodingValue();
       this.codingVersion = new CodingValue();
       this.codingCode = new CodingValue();
       this.codingDisplay = new CodingValue();
       this.codingUserSelected = new CodingValue();
    }
}
