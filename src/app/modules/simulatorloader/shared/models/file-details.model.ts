export class FileDetails {
    fileName: string;
    fileContents: string;
    fileLabel: string;
    constructor (fileLabel: string, fileName: string,   fileContents: string) {
        this.fileLabel = fileLabel;
          this.fileName = fileName ;
          this.fileContents = fileContents;
    }
}
