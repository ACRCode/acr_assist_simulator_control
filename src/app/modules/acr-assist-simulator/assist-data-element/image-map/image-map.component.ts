import { Component, OnInit, Input } from '@angular/core';
import { ChoiceDataElement } from 'testruleengine/Library/Models/Class';
import { UtilityService } from '../../../core/services/utility.service';

const $ = require('jquery');

@Component({
  selector: 'acr-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.css']
})
export class ImageMapComponent implements OnInit {

  imageExist = true;
  SelectionValue = '';

  @Input() DataElement: ChoiceDataElement;
  @Input() assetsBaseUrl: string;
  @Input() DataElements: object = {};
  @Input() FormValues: object = {};

  constructor(
    private utilityService: UtilityService
  ) {
  }

  ngOnInit() {
    if (this.DataElement === undefined) {
      return;
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
  } isInPolygon(x, y, Coordinates) {
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
      const xi = vs[i][0];
      const yi = vs[i][1];
      const xj = vs[j][0];
      const yj = vs[j][1];
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
    const $elem = $(e.target);

    const N_height = $elem.height();
    const N_width = $elem.width();


    const offset = $elem.offset();

    const offset_t = offset.top - $(window).scrollTop();
    const offset_l = offset.left - $(window).scrollLeft();

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
      } else if (opt.Shape === 'poly') {
        if (this.isInPolygon(x, y, opt.Coordinates)) {
          this.FormValues[dataElement.ID] = opt.Value;
          break;
        }
      }
    }
  }

  setValue(val) {
    for (const optValue of this.DataElement.choiceInfo) {
      if (this.DataElement.choiceInfo.length <= 2 && this.DataElement.choiceInfo.length > 0) {
        if (optValue.value === val) {
          $('#' + val + '_' + this.DataElement.id).prop('checked', true);
          const customEvent = document.createEvent('Event');
          customEvent.initEvent('change', true, true);
          $('#' + val + '_' + this.DataElement.id)[0].dispatchEvent(customEvent);
        } else {
          $('#' + optValue.value + '_' + this.DataElement.id).prop('checked', false);
        }
      } else {
        if (optValue.value === val) {
          $('#' + this.DataElement.id).val(optValue.value);
          const customEvent = document.createEvent('Event');
          customEvent.initEvent('change', true, true);
          $('#' + this.DataElement.id)[0].dispatchEvent(customEvent);
          break;
        }
      }
    }
    this.DataElement.currentValue = val;
  }

  displayValue(val) {
    if (val === '') {
      this.SelectionValue = 'Image Map Diagram';
    } else {
      this.SelectionValue = 'Selected Value : ' + val;
    }
  }

  getImageDataUrl(label: string): string {
    if (this.utilityService.isNotEmptyString(label)) {
      if (this.utilityService.isImageDataUrl(label)) {
        return label;
      } else if (this.utilityService.isValidInstance(this.assetsBaseUrl)) {
        return `${this.assetsBaseUrl}/${label}`;
      }
    }

    // return 'assets/images/COVID19.jpg';
  }
}
