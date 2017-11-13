import { EventEmitter } from '@angular/core';
import { FileDetails } from '../share/models/file-details.model';
export declare class FileUploadLoaderComponent {
    onFileContentRead: EventEmitter<FileDetails>;
    fileReader: FileReader;
    readFile: File;
    changeListener($event: any): void;
    readThis(inputValue: any): void;
}
