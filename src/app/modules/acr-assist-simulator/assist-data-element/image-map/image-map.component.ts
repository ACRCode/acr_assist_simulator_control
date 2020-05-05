import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilityService } from '../../../core/services/utility.service';
import { SimulatorEngineService } from 'src/app/modules/core/services/simulator-engine.service';
import { ChoiceDataElement, MultiChoiceDataElement } from 'testruleengine/Library/Models/Class';

const $ = require('jquery');

@Component({
  selector: 'acr-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.css']
})
export class ImageMapComponent implements OnInit {

  selectionValue = '';
  imageExist = true;
  formValues: object = {};
  selectedValues = [];

  @Input() dataElement: ChoiceDataElement | MultiChoiceDataElement;
  @Input() assetsBaseUrl: string;
  @Output() areaSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private simulatorEngineService: SimulatorEngineService,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit() {
    this.selectedValues = [];
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
          this.formValues[dataElement.ID] = opt.Value;
          break;
        }
      } else if (opt.Shape === 'circle') {
        if (this.isInCircle(x, y, opt.Coordinates)) {
          this.formValues[dataElement.ID] = opt.Value;
          break;
        }
      } else if (opt.Shape === 'poly') {
        if (this.isInPolygon(x, y, opt.Coordinates)) {
          this.formValues[dataElement.ID] = opt.Value;
          break;
        }
      }
    }
  }

  setValue(val) {
    const choice = this.dataElement.choiceInfo.find(x => x.value.toLowerCase() === val.toLowerCase());
    if (this.utilityService.isValidInstance(choice)) {
      if (this.dataElement.dataElementType === 'MultiChoiceDataElement') {
        const values = this.simulatorEngineService.getAllDataElementValues().get(this.dataElement.id);
        let checked = true;
        if (this.utilityService.isNotEmptyArray(values)) {
          if (values.indexOf(val) >= 0) {
            checked = false;
          }
        }
        if (checked) {
          this.selectedValues.push(choice.value);
        } else {
          this.selectedValues.splice(this.selectedValues.indexOf(choice.value));
        }
        $('#' + this.dataElement.id + '_' + this.dataElement.choiceInfo[this.dataElement.choiceInfo.findIndex(
          x => x.value === choice.value)].value).prop('checked', checked);
        const customEvent = document.createEvent('Event');
        customEvent.initEvent('change', true, true);
        $('#' + this.dataElement.id + '_' + this.dataElement.choiceInfo[this.dataElement.choiceInfo.findIndex(
          x => x.value === choice.value)].value)[0].dispatchEvent(customEvent);
      } else {
        this.selectedValues.push(choice.value);
        this.areaSelected.emit({
          id: this.dataElement.id,
          label: this.dataElement.label,
          choiceLabel: choice.label,
          choiceValue: choice.value
        });
      }
    }
  }

  getSelectedValue() {
    if (this.selectedValues.length) {
      return 'Selected Values : ' + this.selectedValues.join(' | ');
    } else {
      return 'Image Map Diagram';
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
  }
}
