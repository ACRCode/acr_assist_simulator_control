import { CodingSystemEnum } from '../enums/codingSystem.enum';

export class Coding {
    system: CodingSystemEnum;
    version: Text;
    code: Text;
    display: Text;
    userSelected: boolean;
}

