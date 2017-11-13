import { Component, Input } from '@angular/core';
export class HintDiagramComponent {
}
HintDiagramComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-hint-diagram',
                template: `
    <button type="button" class="btn btn-default btn-xs" data-toggle="modal" attr.data-target="#{{'diag_'+DataElement.ID}}">
      <span class=" glyphicon glyphicon-cd" aria-hidden="true" data-toggle="tooltip"  data-placement="right" title="Hint Diagrams"></span>

    </button>
    <div class="modal fade adjust-diagram " tabindex="-1" role="dialog" attr.id="{{'diag_'+DataElement.ID}}" aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog modal-lg adjust-diagram-image " role="document">
    <div class="modal-content">
    <div class="modal-header">
    <h4 class="modal-title">
    {{DataElement.Label}}
    </h4>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
    </div>



    <div class="carousel slide" data-ride="carousel" data-interval="false">


    <!-- Wrapper for slides -->

    <div class="carousel-inner" role="listbox">
    <ng-container *ngFor="let diag of DataElement.Diagrams ">
    <ng-container *ngIf="DataElement.Diagrams.indexOf(diag) == 0">
    <div class="item active">
    <img src="{{diag.Location}}">
    <!--<div class="carousel-caption">

    </div>-->
    </div>
    </ng-container>

    <ng-container *ngIf="DataElement.Diagrams.indexOf(diag) > 0">
    <div class="item">
    <img src="{{diag.Location}}">
    <!--<div class="carousel-caption">

    </div>-->
    </div>
    </ng-container>

    </ng-container>




    </div>
    <ng-container *ngIf="DataElement.Diagrams.length > 1">
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
HintDiagramComponent.ctorParameters = () => [];
HintDiagramComponent.propDecorators = {
    'DataElement': [{ type: Input },],
};
function HintDiagramComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    HintDiagramComponent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    HintDiagramComponent.ctorParameters;
    /** @type {?} */
    HintDiagramComponent.propDecorators;
    /** @type {?} */
    HintDiagramComponent.prototype.DataElement;
}
//# sourceMappingURL=hint-diagram.component.js.map