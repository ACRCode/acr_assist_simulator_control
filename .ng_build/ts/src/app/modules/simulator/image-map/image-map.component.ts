import { Component, OnInit , Input} from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';

declare var require: any;

@Component({
  selector: 'acr-image-map',
  template: `
    <ng-container *ngIf="DataElement.ImagePath != undefined">

      <div class="row">
        <div class="col-sm-12 text-center">
          OR
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 text-left">
          Select value from image:-
            <button type="button" class="btn btn-default" data-toggle="modal" attr.data-target="#{{'imgMap_Modal_'+DataElement.ID}}">
            <span class="glyphicon glyphicon-picture" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Image Map"></span>
          </button>
        </div>
      </div>

      <ng-container *ngIf="DataElement.ImagePath != undefined">
        <div class="modal fade img-modal" tabindex="-1" role="dialog" attr.id="{{'imgMap_Modal_'+DataElement.ID}}" aria-labelledby="mySmallModalLabel">
          <div class="modal-dialog modal-lg" role="document" [ngStyle]="{'width':DataElement.ImagePath.width + 30}">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">
                  {{SelectionValue}}
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-12">
                    <ng-container *ngIf="imageExist == true">
                      <img class="ImgOption danger" alt="No Image Available!!!" data-dismiss="modal" attr.id="{{'imgMap_Img_'+DataElement.ID}}"
                        (click)="imageClick($event,DataElement);" attr.data-elementID="{{DataElement.ID}}" attr.usemap="#{{'imgMap_'+DataElement.ID}}"
                        src="{{DataElement.ImagePath}}">
                      <map name="{{'imgMap_'+DataElement.ID}}">
                        <ng-container *ngFor="let imgOpt of DataElement.ImageOptions">
                          <area attr.shape="{{imgOpt.Shape}}" attr.imgID="{{'imgMap_Img_'+DataElement.ID}}" attr.coords="{{imgOpt.Coordinates}}" attr.alt="{{imgOpt.Value}}"
                            onmouseover='myHover(this);' onmouseout='myLeave();' (mouseover)='displayValue(imgOpt.Value);' (mouseout)='displayValue("");'
                            (click)="setValue(imgOpt.Value);" data-dismiss="modal">
                        </ng-container>
                      </map>
                    </ng-container>

                    <ng-container *ngIf="imageExist == false">
                      <div class="">
                        No Image Map Available...
                      </div>
                    </ng-container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </ng-container>
  `,
  styles: [`

  `]
})

export class ImageMapComponent  implements OnInit {


      $ = require('jquery');
      @Input() DataElement: DataElement;
      @Input() DataElements: Object = {};
      @Input() FormValues: Object = {};
      imageExist = true;
      SelectionValue = '';

      ngOnInit() {
        const request = new XMLHttpRequest();
        request.open('HEAD',  this.DataElement.ImagePath, false);
        request.send();
        if (request.status === 200) {
          this.imageExist = true;
        } else {
          this.imageExist = false;
        }
        this.displayValue('');
      }

      isInRectangle(mouseX, mouseY, Coordinates) {
          const COArray = Coordinates.split(',');
          if (COArray[0] < mouseX
              && (COArray[0] + COArray[2]) > mouseX
              && COArray[1] < mouseY
              && (COArray[1] + COArray[3]) > mouseY) {
              return true;
          }
          return false;
      }

      isInCircle(mouseX, mouseY, Coordinates) {
          const COArray = Coordinates.split(',');
          if (Math.sqrt(Math.pow((mouseX - COArray[0]), 2) + Math.pow((mouseY - COArray[1]), 2)) < COArray[2]) {
            return true;
          } else {
              return false;
          }
      }

      isInPolygon(x, y, Coordinates) {
          const COArray = Coordinates.split(',');
          const vs = [];
          for (let i = 0; i < COArray.length; i++) {
              const point = [];
              point.push(COArray[i]);
              point.push(COArray[i + 1]);
              i += 1;
              vs.push(point);
          }
          let inside = false;
          for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
              const xi = vs[i][0], yi = vs[i][1];
              const xj = vs[j][0], yj = vs[j][1];
              const intersect = ((yi > y) !== (yj > y))
                  && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
              if (intersect) {
                inside = !inside;
              }
          }
          return inside;
      }

        imageClick(e, dataElement) {
            const O_height = dataElement.ImageProp.height;
            const O_width = dataElement.ImageProp.width;
            const $elem = this.$(e.target);

            const N_height = $elem.height();
            const N_width = $elem.width();


            const offset = $elem.offset();

            const offset_t = offset.top - this.$(window).scrollTop();
            const offset_l = offset.left - this.$(window).scrollLeft();

            const x = e.clientX - offset_l;
            const y = e.clientY - offset_t;
            for (const opt of dataElement.ImageOptions) {
                if (opt.Shape === 'rect') {
                    if (this.isInRectangle(x, y, opt.Coordinates)) {
                        this.FormValues[dataElement.ID] = opt.Value;
                        break;
                    }
                } else if (opt.Shape === 'circle') {
                    if (this.isInCircle(x, y, opt.Coordinates)) {
                        this.FormValues[dataElement.ID] = opt.Value;
                        break;
                    }
                }  else if (opt.Shape === 'poly') {
                    if (this.isInPolygon(x, y, opt.Coordinates)) {
                        this.FormValues[dataElement.ID] = opt.Value;
                        break;
                    }
                }

            }

        }

        setValue(val) {

            this.FormValues[this.DataElement.ID] = val;
        }

        displayValue(val) {
            if (val === '') {
                this.SelectionValue = 'Image Map Diagram';
            } else {
                this.SelectionValue = 'Selected Value : ' + val;
            }
        }

}
