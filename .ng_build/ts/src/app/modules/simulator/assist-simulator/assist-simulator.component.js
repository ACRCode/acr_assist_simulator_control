import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { GlobalsService } from '../shared/services/globals.service';
import { TemplateDetails } from '../shared/models/template-details.model';
import { XMLUtil } from '../shared/utils/XMLUtil';
export class AssistSimulatorComponent {
    /**
     * @param {?} globalsService
     * @param {?} cd
     */
    constructor(globalsService, cd) {
        this.globalsService = globalsService;
        this.cd = cd;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.processData();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.processData();
    }
    /**
     * @return {?}
     */
    resetData() {
        this.FormValues = {};
        this.BaseFormValues = {};
        this.ExpressionBlocks = [];
        this.DataElements = [];
        this.ValidationBlocks = [];
        this.DataElementObj = {};
        this.globalsService.XMLAcronyms = {};
        this.ExpressionBlocks = [];
        this.DataElements = [];
        this.Metadata = undefined;
        this.FormValues = {};
        this.ValidationBlocks = [];
        this.globalsService.evaluateExpessions = true;
        this.globalsService.ComputedElementConditions = {};
        this.globalsService.XMLAcronyms = {};
    }
    /**
     * @return {?}
     */
    processData() {
        this.resetData();
        this.isValid = this.templateContent.length > 0 && this.imagePath.length > 0;
        const /** @type {?} */ templateDetails = new TemplateDetails();
        templateDetails.imagePath = this.imagePath;
        templateDetails.templateContent = this.templateContent;
        const /** @type {?} */ util = new XMLUtil();
        util.load(templateDetails);
        this.globalsService.XMLAcronyms = util.Acronyms;
        this.Metadata = util.Metadata;
        this.DataElements = util.DataElements;
        this.ExpressionBlocks = util.ExpressionBlocks;
        this.ValidationBlocks = util.ValidationBlocks;
        this.FormValues = util.FormValues;
        this.BaseFormValues = JSON.parse(JSON.stringify(this.FormValues));
    }
    /**
     * @param {?} notRelevantDataElments
     * @return {?}
     */
    displayDataElements(notRelevantDataElments) {
        this.DataElements.forEach(de => {
            const /** @type {?} */ deindex = this.DataElements.indexOf(de);
            if (notRelevantDataElments !== undefined && notRelevantDataElments.indexOf(deindex) !== -1) {
                de.Visible = false;
            }
            else {
                de.Visible = true;
            }
        });
        this.globalsService.evaluateExpessions = false;
        this.cd.detectChanges();
        this.globalsService.evaluateExpessions = true;
    }
}
AssistSimulatorComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-assist-simulator',
                template: `
    <ng-container *ngIf="(isValid!=true && isValid!= null)">
      <div class="row">
        <div class="col-sm-12 text-center alert alert-danger">
          <ng-container *ngIf="(ErrorCode == 0)">
            {{errorMessage}}. So we are unable to validate XML.
          </ng-container>
          <ng-container *ngIf="(ErrorCode == 1)">
            Selected XML does not meets the XML Schema.
          </ng-container>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="(isValid)">
      <ng-container *ngIf="Metadata != undefined">
        <div class="row">
          <div class="col-sm-12 text-center border-0">
            <h4>
              <strong>{{Metadata.Label}} </strong>
            </h4>
          </div>
        </div>
      </ng-container>
      <div class="row content-padding">
        <ng-container *ngIf="globalsService.LoadkeyDiagram != true">
          <div class="col-sm-12 ">
            <ng-container *ngIf="(isValid)">
                <form #form="ngForm" class="form-horizontal">
                <acr-data-element [ValidationBlocks]="ValidationBlocks" [DataElements]="DataElements" [FormValues]="FormValues"></acr-data-element>
              </form>
            </ng-container>
          </div>
        </ng-container>
        <ng-container *ngIf="globalsService.LoadkeyDiagram == true">
          <div class="col-sm-7 ">
            <ng-container *ngIf="(isValid)">
               <form #form="ngForm" class="form-horizontal">
                <acr-data-element [ValidationBlocks]="ValidationBlocks" [DataElements]="DataElements" [FormValues]="FormValues"></acr-data-element>
              </form>
            </ng-container>
          </div>
          <div class="col-sm-5 padding-top-5">
            <div id="myNav">
              <ng-container *ngIf="Metadata != undefined">
                <ng-container *ngIf="globalsService.LoadkeyDiagram == true">
                  <div class="carousel slide" data-ride="carousel" data-interval="false">
                    <!-- Wrapper for slides -->
                    <div class="carousel-inner" role="listbox">
                      <ng-container *ngFor="let diag of Metadata.Diagrams ">
                        <ng-container *ngIf="Metadata.Diagrams.indexOf(diag) == 0">
                          <div class="item active">
                            <img src="{{diag.ImagePath}}">
                          </div>
                        </ng-container>

                        <ng-container *ngIf="Metadata.Diagrams.indexOf(diag) > 0">
                          <div class="item">
                          </div>
                        </ng-container>
                      </ng-container>
                    </div>
                    <ng-container *ngIf="Metadata.Diagrams.length > 1">
                      <!-- Controls -->
                      <a class="left carousel-control" onclick="return false;" href="#carousel-example-generic" role="button" data-slide="prev">
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                      </a>
                      <a class="right carousel-control" onclick="return false;" href="#carousel-example-generic" role="button" data-slide="next">
                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                      </a>
                    </ng-container>
                  </div>
                </ng-container>
              </ng-container>
            </div>
          </div>
        </ng-container>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <ng-container >
            <ng-container *ngFor="let block of ExpressionBlocks">
              <acr-expresssion-block [ExpBlock]="block" [FormValues]="FormValues" [DataElements]="DataElements" (onExpressionChanged)="displayDataElements($event)"></acr-expresssion-block>
            </ng-container>
          </ng-container>
        </div>
      </div>
    </ng-container>
  `,
                styles: [`
    .content-padding {
      padding-top: 5px;
      padding-right: 5px;
    }
  `],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
AssistSimulatorComponent.ctorParameters = () => [
    { type: GlobalsService, },
    { type: ChangeDetectorRef, },
];
AssistSimulatorComponent.propDecorators = {
    'templateContent': [{ type: Input },],
    'imagePath': [{ type: Input },],
};
function AssistSimulatorComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    AssistSimulatorComponent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    AssistSimulatorComponent.ctorParameters;
    /** @type {?} */
    AssistSimulatorComponent.propDecorators;
    /** @type {?} */
    AssistSimulatorComponent.prototype.templateContent;
    /** @type {?} */
    AssistSimulatorComponent.prototype.imagePath;
    /** @type {?} */
    AssistSimulatorComponent.prototype.errorMessage;
    /** @type {?} */
    AssistSimulatorComponent.prototype.ErrorCode;
    /** @type {?} */
    AssistSimulatorComponent.prototype.FormValues;
    /** @type {?} */
    AssistSimulatorComponent.prototype.ExpressionBlocks;
    /** @type {?} */
    AssistSimulatorComponent.prototype.isValid;
    /** @type {?} */
    AssistSimulatorComponent.prototype.DataElements;
    /** @type {?} */
    AssistSimulatorComponent.prototype.FormChanged;
    /** @type {?} */
    AssistSimulatorComponent.prototype.BaseFormValues;
    /** @type {?} */
    AssistSimulatorComponent.prototype.ValidationBlocks;
    /** @type {?} */
    AssistSimulatorComponent.prototype.DataElementObj;
    /** @type {?} */
    AssistSimulatorComponent.prototype.Metadata;
    /** @type {?} */
    AssistSimulatorComponent.prototype.globalsService;
    /** @type {?} */
    AssistSimulatorComponent.prototype.cd;
}
//# sourceMappingURL=assist-simulator.component.js.map