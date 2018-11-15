import { CodingSystem } from './codingSystem.model';
import { CodingVersion } from './coding.version';
import { CodingCode } from './codingCode.model';
import { CodingDisplay } from './codingDisplay.model';
import { CodingUserSelected } from './codingUserSelected.model';

export class Coding {
    codingSystem: CodingSystem;
    codingVersion: CodingVersion;
    codingCode: CodingCode;
    codingDisplay: CodingDisplay;
    codingUserSelected: CodingUserSelected;

    constructor() {
       this.codingSystem = new CodingSystem();
       this.codingVersion = new CodingVersion();
       this.codingCode = new CodingCode();
       this.codingDisplay = new CodingDisplay();
       this.codingUserSelected = new CodingUserSelected();
    }
}

