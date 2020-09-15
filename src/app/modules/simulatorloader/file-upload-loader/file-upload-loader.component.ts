import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { FileDetails } from '../shared/models/file-details.model';
import { GlobalsService } from '../shared/services/globals.service';
import { UtilityService } from '../../core/services/utility.service';
import { getTemplate } from 'testruleengine/Library/Utilities/TemplateManager';
import { ToastrService } from 'ngx-toastr';
const $ = require('jquery');

@Component({
  selector: 'acr-file-upload-loader',
  templateUrl: './file-upload-loader.component.html',
  styleUrls: ['./file-upload-loader.component.css']
})

export class FileUploadLoaderComponent implements OnInit, OnDestroy {

  fileReader: FileReader = new FileReader();
  readFile: File;
  defaultModuleSubscription: ISubscription;
  testModuleSubscription: ISubscription;

  @Output() fileContentRead: EventEmitter<FileDetails> = new EventEmitter<FileDetails>();

  constructor(
    private toastr: ToastrService,
    private configService: GlobalsService,
    private utilityService: UtilityService) {
  }

  ngOnInit(): void {
    this.hideMessage();
    this.showTestModule();
    this.showDefaultModule();
  }

  ngOnDestroy() {
    if (this.utilityService.isValidInstance(this.defaultModuleSubscription)) {
      this.defaultModuleSubscription.unsubscribe();
    }
    if (this.utilityService.isValidInstance(this.testModuleSubscription)) {
      this.testModuleSubscription.unsubscribe();
    }
  }

  changeListener($event): void {
    let fileName: string;
    fileName = $event.target.value;
    if (fileName.includes('.xml') || fileName.includes('.Xml') || fileName.includes('.XML') ||
      fileName.includes('.zip') || fileName.includes('.Zip') || fileName.includes('.ZIP')) {
      this.hideMessage();
      this.readThis($event.target);
    } else {
      if (fileName !== '' && fileName !== undefined) {
        $('#xmlOnlyMsg').show();
      }
    }

    const target = $event.target || $event.srcElement;
    target.value = '';
  }

  hideMessage() {
    $('#xmlOnlyMsg').hide();
  }

  private showDefaultModule() {
    this.configService.getDefaultModulePath()
      .subscribe(data => {
        const self = this;
        self.fileContentRead.emit(new FileDetails('Hello Assist 2.0', 'Hello_Assist.xml', data));
      });
  }

  private showTestModule() {
    this.configService.getDefaultTestModulePath()
      .subscribe(data => {
        const self = this;
        self.fileContentRead.emit(new FileDetails('Test Module', 'Test_Module.xml', data));
      });
  }

  private readThis(inputValue: any): void {
    this.readFile = inputValue.files[0];
    const self = this;
    const extensionStartPosition = self.readFile.name.lastIndexOf('.');
    this.fileReader.onloadend = (e) => {
      try {
        const template = getTemplate(this.fileReader.result.toString());
        if (template) {
          self.fileContentRead.emit(
            new FileDetails(self.readFile.name.substring(0, extensionStartPosition),
              self.readFile.name, this.fileReader.result.toString()));
        }
      }
      catch (error) {
        this.toastr.error('Failed to load the module');
      }
    };

    this.fileReader.readAsText(this.readFile);
  }
}
