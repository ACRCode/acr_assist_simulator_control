import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { UtilityService } from '../../../core/services/utility.service';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { ChoiceDataElement, MultiChoiceDataElement } from 'testruleengine/Library/Models/Class';

const $ = require('jquery');

@Component({
  selector: 'acr-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.css']
})
export class ImageMapComponent implements OnInit {

  selectionValue = '';
  map_selector_class = 'cursor-pointer map-selector';
  formValues: object = {};
  isOverlayLoading = false;
  selectedValues = [];
  hoverDefaultColour = 'rgba(56, 59, 60, 0.5)';
  filledDefaultColour = 'rgba(27, 33, 36, 0.5)';
  borderDefaultColour = '2px solid rgba(0, 0, 0, 0)';

  @Input() dataElement: ChoiceDataElement | MultiChoiceDataElement;
  @Input() assetsBaseUrl: string;
  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChildren('imageMapAreas') imageMapAreas: QueryList<ElementRef>;
  @ViewChildren('selectors') selectors: QueryList<ElementRef>;

  constructor(
    private simulatorEngineService: SimulatorEngineService,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit() {
    this.selectedValues = [];
  }

  ok() {
    alert('ok');
  }

  initializeSelectedOverlayData() {
    const values = this.simulatorEngineService.getAllDataElementValues().get(this.dataElement.id);
    if (Array.isArray(values) && this.utilityService.isNotEmptyArray(values)) {
      this.selectedValues = values;
    }
    this.isOverlayLoading = true;
    setTimeout(() => {
      let hoverColor;
      let filledColor;
      let outlineColor;

      for (let index = 0; index < this.dataElement.imageMap.map.areas.length; index++) {
        if (this.utilityService.isValidInstance(this.imageMapAreas)) {
          let hasValueSelected = false;
          if (Array.isArray(values)) {
            hasValueSelected = values.indexOf(this.dataElement.imageMap.map.areas[index].choiceValue) >= 0;
          } else {
            hasValueSelected = values === this.dataElement.imageMap.map.areas[index].choiceValue;
          }
          const currentArea = this.imageMapAreas.toArray()[index];
          const coords = currentArea.nativeElement.attributes.coords.value.split(',');
          const height = this.container.nativeElement.offsetHeight;
          const selector = this.selectors.toArray()[index];
          const elementDrawStyle = this.dataElement.imageMap.drawStyle;

          if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.hoverFill) &&
            this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.hoverFill.value)) {
            hoverColor = currentArea.nativeElement.attributes.hoverFill.value;
          } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
            this.utilityService.isNotEmptyString(elementDrawStyle.hoverFill)) {
            hoverColor = elementDrawStyle.hoverFill;
          } else {
            hoverColor = this.hoverDefaultColour;
          }

          if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.selectedFill) &&
            this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.selectedFill.value)) {
            filledColor = currentArea.nativeElement.attributes.selectedFill.value;
          } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
            this.utilityService.isNotEmptyString(elementDrawStyle.selectedFill)) {
            filledColor = elementDrawStyle.selectedFill;
          } else {
            filledColor = this.filledDefaultColour;
          }

          if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.outline) &&
            this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.outline.value)) {
            outlineColor = '2px solid ' + currentArea.nativeElement.attributes.outline.value;
          } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
            this.utilityService.isNotEmptyString(elementDrawStyle.outline)) {
            outlineColor = '2px solid ' + elementDrawStyle.outline;
          } else {
            outlineColor = this.borderDefaultColour;
          }

          if (this.utilityService.isValidInstance(selector)) {
            selector.nativeElement.style.opacity = '0.4';
            if (selector.nativeElement.className.includes('hover') || selector.nativeElement.className.includes('selected')) {
              selector.nativeElement.style.position = '';
              selector.nativeElement.style.background = '';
              selector.nativeElement.style.border = '';
              selector.nativeElement.className = this.map_selector_class;
            }
            if (hasValueSelected) {
              selector.nativeElement.style.position = 'absolute';
              selector.nativeElement.style.background = filledColor;
              selector.nativeElement.style.border = outlineColor;
              selector.nativeElement.style.left = coords[0] + 'px';
              selector.nativeElement.style.top = coords[1] + 'px';
              selector.nativeElement.style.right = '0px';
              selector.nativeElement.style.bottom = (height - coords[3]) + 'px';
              selector.nativeElement.className += ' selected';
            }
          }
        }
      }
      this.isOverlayLoading = false;
    }, 1000);
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

  setSelectedValue(index) {
    if (this.utilityService.isValidInstance(this.imageMapAreas)) {
      const currentArea = this.imageMapAreas.toArray()[index];
      if (this.utilityService.isValidInstance(currentArea)) {
        this.setOverLaysforImageMap(index, currentArea);
        this.setSelectedValues(currentArea.nativeElement.attributes.choice.value);
      }
    }
  }

  getSelectedValue() {
    if (this.utilityService.isNotEmptyArray(this.selectedValues)) {
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

  addRemoveHoverClass(index, isAdd) {
    let hoverColor;
    let outlineColor;

    if (this.utilityService.isValidInstance(this.imageMapAreas)) {
      const currentArea = this.imageMapAreas.toArray()[index];
      if (this.utilityService.isValidInstance(currentArea)) {
        const coords = currentArea.nativeElement.attributes.coords.value.split(',');
        const height = this.container.nativeElement.offsetHeight;
        const selector = this.selectors.toArray()[index];
        const elementDrawStyle = this.dataElement.imageMap.drawStyle;

        if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.hoverFill) &&
          this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.hoverFill.value)) {
          hoverColor = currentArea.nativeElement.attributes.hoverFill.value;
        } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
          this.utilityService.isNotEmptyString(elementDrawStyle.hoverFill)) {
          hoverColor = elementDrawStyle.hoverFill;
        } else {
          hoverColor = this.hoverDefaultColour;
        }

        if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.outline) &&
          this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.outline.value)) {
          outlineColor = '2px solid ' + currentArea.nativeElement.attributes.outline.value;
        } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
          this.utilityService.isNotEmptyString(elementDrawStyle.outline)) {
          outlineColor = '2px solid ' + elementDrawStyle.outline;
        } else {
          outlineColor = this.borderDefaultColour;
        }

        if (this.utilityService.isValidInstance(selector)) {
          if (isAdd) {
            if (!selector.nativeElement.className.includes('hover') && !selector.nativeElement.className.includes('selected')) {
              selector.nativeElement.style.position = 'absolute';
              selector.nativeElement.style.background = hoverColor;
              selector.nativeElement.style.border = outlineColor;
              selector.nativeElement.className += ' hover';
            }
          } else {
            if (!selector.nativeElement.className.includes('selected')) {
              selector.nativeElement.style.position = '';
              selector.nativeElement.style.border = '';
            }
            selector.nativeElement.style.background = selector.nativeElement.style.background.replace(hoverColor, '').trim();
            selector.nativeElement.className = selector.nativeElement.className.replace('hover', '').trim();
          }
          selector.nativeElement.style.opacity = '0.4';
          selector.nativeElement.style.left = coords[0] + 'px';
          selector.nativeElement.style.top = coords[1] + 'px';
          selector.nativeElement.style.right = '0px';
          selector.nativeElement.style.bottom = (height - coords[3]) + 'px';
        }
      }
    }
  }

  private setSelectedValues(selectedValue: string) {
    const choice = this.dataElement.choiceInfo.find(x => x.value.toLowerCase() === selectedValue.toLowerCase());
    if (this.utilityService.isValidInstance(choice)) {
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('change', true, true);

      if (this.dataElement.dataElementType === 'MultiChoiceDataElement') {
        const values = this.simulatorEngineService.getAllDataElementValues().get(this.dataElement.id);
        let checked = true;
        if (this.utilityService.isNotEmptyArray(values) && values.indexOf(selectedValue) >= 0) {
          checked = false;
        }
        checked ? this.selectedValues.push(choice.value) : this.selectedValues.splice(this.selectedValues.indexOf(choice.value));
        $('#' + this.dataElement.id + '_' + choice.value).prop('checked', checked);
        $('#' + this.dataElement.id + '_' + choice.value)[0].dispatchEvent(customEvent);

      } else if (choice.value === selectedValue) {
        if (this.dataElement.choiceInfo.length <= 2 && this.dataElement.choiceInfo.length > 0) {
          $('#' + choice.value + '_' + this.dataElement.id).prop('checked', true);
          $('#' + choice.value + '_' + this.dataElement.id)[0].dispatchEvent(customEvent);
        } else {
          $('#' + this.dataElement.id).val(choice.value);
          $('#' + this.dataElement.id)[0].dispatchEvent(customEvent);
        }
      }
    }
  }

  private setOverLaysforImageMap(index: number, currentArea: ElementRef) {
    let filledColor;
    let outlineColor;

    const coords = currentArea.nativeElement.attributes.coords.value.split(',');
    const height = this.container.nativeElement.offsetHeight;
    const selector = this.selectors.toArray()[index];
    const elementDrawStyle = this.dataElement.imageMap.drawStyle;

    if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.selectedFill) &&
      this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.selectedFill.value)) {
      filledColor = currentArea.nativeElement.attributes.selectedFill.value;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.selectedFill)) {
      filledColor = elementDrawStyle.selectedFill;
    } else {
      filledColor = this.filledDefaultColour;
    }

    if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.outline) &&
      this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.outline.value)) {
      outlineColor = '2px solid ' + currentArea.nativeElement.attributes.outline.value;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.outline)) {
      outlineColor = '2px solid ' + elementDrawStyle.outline;
    } else {
      outlineColor = this.borderDefaultColour;
    }

    if (this.utilityService.isValidInstance(selector)) {
      if (selector.nativeElement.className.includes('selected')) {
        selector.nativeElement.style.position = '';
        selector.nativeElement.style.background = '';
        selector.nativeElement.style.border = '';
        selector.nativeElement.style.opacity = '';
        selector.nativeElement.className = this.map_selector_class;
      } else {
        selector.nativeElement.style.position = 'absolute';
        selector.nativeElement.style.background = filledColor;
        selector.nativeElement.style.border = outlineColor;
        selector.nativeElement.style.opacity = '0.4';
        selector.nativeElement.style.left = coords[0] + 'px';
        selector.nativeElement.style.top = coords[1] + 'px';
        selector.nativeElement.style.right = '0px';
        selector.nativeElement.style.bottom = (height - coords[3]) + 'px';
        selector.nativeElement.className = this.map_selector_class + ' selected';
      }
    }
  }
}
