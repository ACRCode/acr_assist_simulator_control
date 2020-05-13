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
  borderDefaultColour = '1px solid rgba(0, 0, 0, 0)';

  @Input() dataElement: ChoiceDataElement | MultiChoiceDataElement;
  @Input() assetsBaseUrl: string;
  @ViewChildren('imageMapAreas') imageMapAreas: QueryList<ElementRef>;
  @ViewChildren('canvases') canvases: QueryList<ElementRef>;

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
          const canvas = this.canvases.toArray()[index];
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
            outlineColor = '1px solid ' + currentArea.nativeElement.attributes.outline.value;
          } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
            this.utilityService.isNotEmptyString(elementDrawStyle.outline)) {
            outlineColor = '1px solid ' + elementDrawStyle.outline;
          } else {
            outlineColor = this.borderDefaultColour;
          }

          if (this.utilityService.isValidInstance(canvas)) {
            if (canvas.nativeElement.className.includes('hover') || canvas.nativeElement.className.includes('selected')) {
              canvas.nativeElement.style.position = '';
              canvas.nativeElement.style.display = 'none';
              canvas.nativeElement.style.backgroundColor = '';
              canvas.nativeElement.style.border = '';
              canvas.nativeElement.style.opacity = '';
              canvas.nativeElement.style.borderRadius = '';
              canvas.nativeElement.style.height = '';
              canvas.nativeElement.className = this.map_selector_class;
            }
            if (hasValueSelected) {
              canvas.nativeElement.style.position = 'absolute';
              canvas.nativeElement.style.display = 'block';
              canvas.nativeElement.style.backgroundColor = filledColor;
              canvas.nativeElement.style.border = outlineColor;
              canvas.nativeElement.style.opacity = '0.4';

              this.drawStyleBasedOnShape(canvas, shape, coords);
              canvas.nativeElement.className = this.map_selector_class + ' selected';
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
    let filledColor;
    let outlineColor;

    if (this.utilityService.isValidInstance(this.imageMapAreas)) {
      const currentArea = this.imageMapAreas.toArray()[index];
      if (this.utilityService.isValidInstance(currentArea)) {
        const coords = currentArea.nativeElement.attributes.coords.value.split(',');
        const shape = currentArea.nativeElement.attributes.shape.value;
        const canvas = this.canvases.toArray()[index];
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

        if (hoverColor === filledColor) {
          hoverColor = this.hoverDefaultColour;
        }

        if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.outline) &&
          this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.outline.value)) {
          outlineColor = '1px solid ' + currentArea.nativeElement.attributes.outline.value;
        } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
          this.utilityService.isNotEmptyString(elementDrawStyle.outline)) {
          outlineColor = '1px solid ' + elementDrawStyle.outline;
        } else {
          outlineColor = this.borderDefaultColour;
        }

        if (this.utilityService.isValidInstance(canvas)) {
          if (isAdd) {
            if (!canvas.nativeElement.className.includes('hover') && !canvas.nativeElement.className.includes('selected')) {
              canvas.nativeElement.style.position = 'absolute';
              canvas.nativeElement.style.display = 'block';
              canvas.nativeElement.style.backgroundColor = hoverColor;
              canvas.nativeElement.style.border = outlineColor;
              canvas.nativeElement.className += ' hover';
            }

            canvas.nativeElement.style.opacity = '0.4';
            this.drawStyleBasedOnShape(canvas, shape, coords);
          } else {
            if (!canvas.nativeElement.className.includes('selected')) {
              canvas.nativeElement.style.position = '';
              canvas.nativeElement.style.display = 'none';
              canvas.nativeElement.style.border = '';
              canvas.nativeElement.style.borderRadius = '';
              canvas.nativeElement.style.height = '';
            }
            canvas.nativeElement.style.backgroundColor = canvas.nativeElement.style.backgroundColor.replace(hoverColor, '').trim();
            canvas.nativeElement.className = canvas.nativeElement.className.replace('hover', '').trim();
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
    const canvas = this.canvases.toArray()[index];
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
      outlineColor = '1px solid ' + currentArea.nativeElement.attributes.outline.value;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.outline)) {
      outlineColor = '1px solid ' + elementDrawStyle.outline;
    } else {
      outlineColor = this.borderDefaultColour;
    }

    if (this.utilityService.isValidInstance(canvas)) {
      if (canvas.nativeElement.className.includes('selected')) {
        canvas.nativeElement.style.position = '';
        canvas.nativeElement.style.display = 'none';
        canvas.nativeElement.style.backgroundColor = '';
        canvas.nativeElement.style.border = '';
        canvas.nativeElement.style.opacity = '';
        canvas.nativeElement.style.borderRadius = '';
        canvas.nativeElement.style.height = '';
        canvas.nativeElement.className = this.map_selector_class;
      } else {
        canvas.nativeElement.style.position = 'absolute';
        canvas.nativeElement.style.display = 'block';
        canvas.nativeElement.style.backgroundColor = filledColor;
        canvas.nativeElement.style.border = outlineColor;
        canvas.nativeElement.style.opacity = '0.4';

        this.drawStyleBasedOnShape(canvas, shape, coords);
        canvas.nativeElement.className = this.map_selector_class + ' selected';
      }
    }
  }

  private drawStyleBasedOnShape(canvas: ElementRef, shape: string, coords: number[]) {
    if (shape.toLowerCase() === 'rect') {
      canvas.nativeElement.style.left = coords[0] + 'px';
      canvas.nativeElement.style.top = coords[1] + 'px';
      canvas.nativeElement.width = coords[2] - coords[0];
      canvas.nativeElement.height = coords[3] - coords[1];
    } else if (shape.toLowerCase() === 'circle') {
      canvas.nativeElement.style.left = (coords[0] - coords[2]) + 'px';
      canvas.nativeElement.style.top = (coords[1] - coords[2]) + 'px';
      canvas.nativeElement.style.width = (2 * coords[2]) + 'px';
      canvas.nativeElement.style.height = (2 * coords[2]) + 'px';
      canvas.nativeElement.style.borderRadius = '50%';
    }
  }
}
