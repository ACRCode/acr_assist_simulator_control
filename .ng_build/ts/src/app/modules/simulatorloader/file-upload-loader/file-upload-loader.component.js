import { Component, Output, EventEmitter } from '@angular/core';
import { FileDetails } from '../share/models/file-details.model';
export class FileUploadLoaderComponent {
    constructor() {
        this.onFileContentRead = new EventEmitter();
        this.fileReader = new FileReader();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    changeListener($event) {
        this.readThis($event.target);
    }
    /**
     * @param {?} inputValue
     * @return {?}
     */
    readThis(inputValue) {
        this.readFile = inputValue.files[0];
        const /** @type {?} */ self = this;
        this.fileReader.onloadend = (e) => {
            self.onFileContentRead.emit(new FileDetails(self.readFile.name, this.fileReader.result));
        };
        this.fileReader.readAsText(this.readFile);
    }
}
FileUploadLoaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-file-upload-loader',
                template: `
    <div class = "row">
      <div class= "col-sm-12">
          <div class="panel panel-default">
              <div class="panel-heading">Select  the Template file</div>
              <div class="panel-body">
                  <div class="row">
                        <div class="col-sm-6"> Select the file to be uploaded</div>
                        <div class="col-sm-6"><input type="file" accept=".xml" (change)="changeListener($event)"></div>
                  </div>
              </div>
            </div>
      </div>
    </div>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
FileUploadLoaderComponent.ctorParameters = () => [];
FileUploadLoaderComponent.propDecorators = {
    'onFileContentRead': [{ type: Output },],
};
function FileUploadLoaderComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    FileUploadLoaderComponent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    FileUploadLoaderComponent.ctorParameters;
    /** @type {?} */
    FileUploadLoaderComponent.propDecorators;
    /** @type {?} */
    FileUploadLoaderComponent.prototype.onFileContentRead;
    /** @type {?} */
    FileUploadLoaderComponent.prototype.fileReader;
    /** @type {?} */
    FileUploadLoaderComponent.prototype.readFile;
}
//# sourceMappingURL=file-upload-loader.component.js.map