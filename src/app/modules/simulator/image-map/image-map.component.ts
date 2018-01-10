import { Component, OnInit , Input} from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';
import { ChoiceDataElement } from '../../core/elements/models/choice-data-element-model';

declare var require: any;

@Component({
  selector: 'acr-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['../../styles.css']
})

export class ImageMapComponent  implements OnInit {


      $ = require('jquery');
      @Input() DataElement: ChoiceDataElement;
      @Input() DataElements: Object = {};
      @Input() FormValues: Object = {};
      @Input() imagePath: string;

      imageExist = true;
      SelectionValue = '';

      ngOnInit() {

        if (this.DataElement === undefined) {
            return;
        }
        // const request = new XMLHttpRequest();
        // request.open('HEAD',  this.DataElement.ImagePath, false);
        // request.send();
        // if (request.status === 200) {
        //   this.imageExist = true;
        // } else {
        //   this.imageExist = false;
        // }
        this.displayValue('');
        for (let i = 0; i < this.DataElement.imageMap.map.areas.length; i++) {
            console.log('ImDE' + this.DataElement.imageMap.map.areas[i].choiceValue);
        }
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

            this.FormValues[this.DataElement.id] = val;
        }

        displayValue(val) {
            if (val === '') {
                this.SelectionValue = 'Image Map Diagram';
            } else {
                this.SelectionValue = 'Selected Value : ' + val;
            }
        }

}
