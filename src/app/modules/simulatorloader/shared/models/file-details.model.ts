export class FileDetails {
    fileName: string;
    fileContents: string;
    constructor (fileName: string,   fileContents: string) {
          this.fileName = fileName ;
          this.fileContents = fileContents;
    }
}
