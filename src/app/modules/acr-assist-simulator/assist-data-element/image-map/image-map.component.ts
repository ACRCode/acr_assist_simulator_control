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
  filledDefaultColour = 'rgba(38, 166, 91, 1)';
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
          if (this.utilityService.isNotEmptyArray(values)) {
            if (Array.isArray(values)) {
              hasValueSelected = values.indexOf(this.dataElement.imageMap.map.areas[index].choiceValue) >= 0;
            } else {
              hasValueSelected = values === this.dataElement.imageMap.map.areas[index].choiceValue;
            }
        }
          const currentArea = this.imageMapAreas.toArray()[index];
          const coords = currentArea.nativeElement.attributes.coords.value.split(',');
          const shape = currentArea.nativeElement.attributes.shape.value;
          const height = this.container.nativeElement.offsetHeight;
          const width = this.container.nativeElement.offsetWidth;
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
              selector.nativeElement.style.borderRadius = '';
              selector.nativeElement.style.height = '';
              selector.nativeElement.className = this.map_selector_class;
            }
            if (hasValueSelected) {
              selector.nativeElement.style.position = 'absolute';
              selector.nativeElement.style.background = filledColor;
              selector.nativeElement.style.border = outlineColor;

              if (shape.toLowerCase() === 'rect') {
                selector.nativeElement.style.left = coords[0] + 'px';
                selector.nativeElement.style.top = coords[1] + 'px';
                selector.nativeElement.style.right = (width > +coords[2]) ? (width - +coords[2]) + 'px' : '0px';
                selector.nativeElement.style.bottom = (height - +coords[3]) + 'px';
              } else if (shape.toLowerCase() === 'circle') {
                selector.nativeElement.style.left = (coords[0] - coords[2]) + 'px';
                selector.nativeElement.style.top = (coords[1] - coords[2]) + 'px';
                selector.nativeElement.style.width = (2 * coords[2]) + 'px';
                selector.nativeElement.style.height = (2 * coords[2]) + 'px';
                selector.nativeElement.style.borderRadius = '50%';
              }
              selector.nativeElement.className += ' selected';
            }
          }
        }
      }
      this.isOverlayLoading = false;
    }, 1000);
  }

  setSelectedValue(index) {
    if (this.utilityService.isValidInstance(this.imageMapAreas)) {
      const currentArea = this.imageMapAreas.toArray()[index];
      if (this.utilityService.isValidInstance(currentArea)) {
        if (this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.choice.value)) {
          this.setOverLaysforImageMap(index, currentArea);
          this.setSelectedValues(currentArea.nativeElement.attributes.choice.value);
        }
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
        const shape = currentArea.nativeElement.attributes.shape.value;
        const height = this.container.nativeElement.offsetHeight;
        const width = this.container.nativeElement.offsetWidth;
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
              selector.nativeElement.style.borderRadius = '';
              selector.nativeElement.style.height = '';
            }
            selector.nativeElement.style.background = selector.nativeElement.style.background.replace(hoverColor, '').trim();
            selector.nativeElement.className = selector.nativeElement.className.replace('hover', '').trim();
          }
          selector.nativeElement.style.opacity = '0.4';

          if (shape.toLowerCase() === 'rect') {
            selector.nativeElement.style.left = coords[0] + 'px';
            selector.nativeElement.style.top = coords[1] + 'px';
            selector.nativeElement.style.right = (width > +coords[2]) ? (width - +coords[2]) + 'px' : '0px';
            selector.nativeElement.style.bottom = (height - +coords[3]) + 'px';
          } else if (shape.toLowerCase() === 'circle') {
            if (isAdd) {
              selector.nativeElement.style.left = (coords[0] - coords[2]) + 'px';
              selector.nativeElement.style.top = (coords[1] - coords[2]) + 'px';
              selector.nativeElement.style.width = (2 * coords[2]) + 'px';
              selector.nativeElement.style.height = (2 * coords[2]) + 'px';
              selector.nativeElement.style.borderRadius = '50%';
            }
          }
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
    const shape = currentArea.nativeElement.attributes.shape.value;
    const height = this.container.nativeElement.offsetHeight;
    const width = this.container.nativeElement.offsetWidth;
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
        selector.nativeElement.style.borderRadius = '';
        selector.nativeElement.style.height = '';
        selector.nativeElement.className = this.map_selector_class;
      } else {
        selector.nativeElement.style.position = 'absolute';
        selector.nativeElement.style.background = filledColor;
        selector.nativeElement.style.border = outlineColor;
        selector.nativeElement.style.opacity = '0.4';

        if (shape.toLowerCase() === 'rect') {
          selector.nativeElement.style.left = coords[0] + 'px';
          selector.nativeElement.style.top = coords[1] + 'px';
          selector.nativeElement.style.right = (width > +coords[2]) ? (width - +coords[2]) + 'px' : '0px';
          selector.nativeElement.style.bottom = (height - +coords[3]) + 'px';
        } else if (shape.toLowerCase() === 'circle') {
          selector.nativeElement.style.left = (coords[0] - coords[2]) + 'px';
          selector.nativeElement.style.top = (coords[1] - coords[2]) + 'px';
          selector.nativeElement.style.width = (2 * coords[2]) + 'px';
          selector.nativeElement.style.height = (2 * coords[2]) + 'px';
          selector.nativeElement.style.borderRadius = '50%';
        }
        selector.nativeElement.className = this.map_selector_class + ' selected';
      }
    }
  }
}
