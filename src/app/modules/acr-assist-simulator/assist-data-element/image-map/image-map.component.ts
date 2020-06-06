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
  filledDefaultColour = 'rgba(40, 179, 109, 0.52)';
  borderDefaultColour = 'rgba(0, 0, 0, 1)';

  @Input() dataElement: ChoiceDataElement | MultiChoiceDataElement;
  @Input() assetsBaseUrl: string;
  @ViewChild('image') image: ElementRef;
  @ViewChildren('imageMapAreas') imageMapAreas: QueryList<ElementRef>;
  @ViewChildren('canvases') canvases: QueryList<ElementRef<HTMLCanvasElement>>;

  constructor(
    private simulatorEngineService: SimulatorEngineService,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit() {
    this.selectedValues = [];
  }

  initializeSelectedOverlayData() {
    this.isOverlayLoading = true;
    setTimeout(() => {
      this.restoreSelectedOverlays();
      this.isOverlayLoading = false;
    }, 1000);
  }

  getCoordinates(coordinates: any) {
    if (this.utilityService.isValidInstance(this.image) &&
      this.utilityService.isValidInstance(this.image.nativeElement)) {
      const naturalWidth = this.image.nativeElement.naturalWidth;
      const naturalHeight = this.image.nativeElement.naturalHeight;

      const scaledWidth = this.image.nativeElement.width;
      const scaledHeight = this.image.nativeElement.height;
      coordinates = coordinates.split(',');

      for (let index = 0; index < coordinates.length; index++) {
        if (index % 2 === 0) {
          if (scaledWidth !== naturalWidth) {
            const scalingFactor = scaledWidth / naturalWidth;
            if (coordinates[index]) {
              coordinates[index] = Math.trunc(coordinates[index] * scalingFactor);
            }
          }
        } else {
          if (scaledHeight !== naturalHeight) {
            const scalingFactor = scaledHeight / naturalHeight;
            if (coordinates[index]) {
              coordinates[index] = Math.trunc(coordinates[index] * scalingFactor);
            }
          }
        }
      }
    }
    return coordinates;
  }

  getSelectedValues() {
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

  setSelectedValue(index) {
    if (this.utilityService.isValidInstance(this.imageMapAreas)) {
      const currentArea = this.imageMapAreas.toArray()[index];
      if (this.utilityService.isValidInstance(currentArea)) {
        if (this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.choice.value)) {
          this.updateSelectedOverlay(index, currentArea);
          this.setSelectedValues(currentArea.nativeElement.attributes.choice.value);
        }
      }
    }
  }

  updateHoverOverlay(index, isAdd) {
    if (this.utilityService.isValidInstance(this.imageMapAreas)) {
      const currentArea = this.imageMapAreas.toArray()[index];
      if (this.utilityService.isValidInstance(currentArea)) {
        const coords = currentArea.nativeElement.attributes.coords.value.split(',');
        const shape = currentArea.nativeElement.attributes.shape.value;
        const canvas = this.canvases.toArray()[index];
        const elementDrawStyle = this.dataElement.imageMap.drawStyle;

        let hoverColor = this.getHoverFillColour(currentArea, elementDrawStyle);
        const filledColor = this.getSelectedFillColour(currentArea, elementDrawStyle);
        const outlineColor = this.getOutlineColour(currentArea, elementDrawStyle);

        if (hoverColor === filledColor) {
          hoverColor = this.hoverDefaultColour;
        }

        if (this.utilityService.isValidInstance(canvas)) {
          if (isAdd) {
            if (!canvas.nativeElement.className.includes('hover') && !canvas.nativeElement.className.includes('selected')) {
              canvas.nativeElement.style.position = 'absolute';
              canvas.nativeElement.style.display = 'block';
              canvas.nativeElement.className += ' hover';
              this.drawStyleBasedOnShape(canvas, hoverColor, outlineColor, shape, coords);
            }
          } else {
            if (!canvas.nativeElement.className.includes('selected')) {
              canvas.nativeElement.style.position = '';
              canvas.nativeElement.style.display = 'none';
            }
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
        if (!this.isChoiceHasDiagrams(this.dataElement)) {
          if (this.dataElement.choiceInfo.length <= 2 && this.dataElement.choiceInfo.length > 0) {
            $('#' + choice.value + '_' + this.dataElement.id).prop('checked', true);
            $('#' + choice.value + '_' + this.dataElement.id)[0].dispatchEvent(customEvent);
          } else {
            $('#' + this.dataElement.id).val(choice.value);
            $('#' + this.dataElement.id)[0].dispatchEvent(customEvent);
          }
        } else {
          $('#' + choice.value + '_' + this.dataElement.id).prop('checked', true);
          $('#' + choice.value + '_' + this.dataElement.id)[0].dispatchEvent(customEvent);
        }
      }
    }
  }

  private isChoiceHasDiagrams(dataElement: any) {
    if (this.utilityService.isValidInstance(this.dataElement.choiceInfo)) {
      const choiceDataElementWithDigrams = this.dataElement.choiceInfo.filter(x => this.utilityService.isNotEmptyArray(x.diagrams));
      return this.utilityService.isNotEmptyArray(choiceDataElementWithDigrams) ? true : false;
    }

    return false;
  }

  private restoreSelectedOverlays() {
    const values = this.simulatorEngineService.getAllDataElementValues().get(this.dataElement.id);
    if (Array.isArray(values) && this.utilityService.isNotEmptyArray(values)) {
      this.selectedValues = values;
    }

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
        const shape = currentArea.nativeElement.attributes.shape.value;
        const coords = this.getCoordinates(currentArea.nativeElement.attributes.coords.value);
        const canvas = this.canvases.toArray()[index];
        const elementDrawStyle = this.dataElement.imageMap.drawStyle;

        const filledColor = this.getSelectedFillColour(currentArea, elementDrawStyle);
        const outlineColor = this.getOutlineColour(currentArea, elementDrawStyle);

        if (this.utilityService.isValidInstance(canvas)) {
          if (canvas.nativeElement.className.includes('hover') || canvas.nativeElement.className.includes('selected')) {
            canvas.nativeElement.style.position = '';
            canvas.nativeElement.style.display = 'none';
            canvas.nativeElement.className = this.map_selector_class;
          }
          if (hasValueSelected) {
            canvas.nativeElement.style.position = 'absolute';
            canvas.nativeElement.style.display = 'block';

            this.drawStyleBasedOnShape(canvas, filledColor, outlineColor, shape, coords);
            canvas.nativeElement.className = this.map_selector_class + ' selected';
          }
        }
      }
    }
  }

  private updateSelectedOverlay(index: number, currentArea: ElementRef) {
    const coords = currentArea.nativeElement.attributes.coords.value.split(',');
    const shape = currentArea.nativeElement.attributes.shape.value;
    const canvas = this.canvases.toArray()[index];
    const elementDrawStyle = this.dataElement.imageMap.drawStyle;

    const filledColor = this.getSelectedFillColour(currentArea, elementDrawStyle);
    const outlineColor = this.getOutlineColour(currentArea, elementDrawStyle);

    if (this.utilityService.isValidInstance(canvas)) {
      if (canvas.nativeElement.className.includes('selected')) {
        canvas.nativeElement.style.position = '';
        canvas.nativeElement.style.display = 'none';
        canvas.nativeElement.className = this.map_selector_class;
      } else {
        canvas.nativeElement.style.position = 'absolute';
        canvas.nativeElement.style.display = 'block';

        this.drawStyleBasedOnShape(canvas, filledColor, outlineColor, shape, coords);
        canvas.nativeElement.className = this.map_selector_class + ' selected';
      }
    }
  }

  private drawStyleBasedOnShape(canvas: ElementRef, fillStyle: string, outlineStyle: string, shape: string, coords: number[]) {
    const ctx = canvas.nativeElement.getContext('2d');
    if (shape.toLowerCase() === 'rect') {
      canvas.nativeElement.style.left = coords[0] + 'px';
      canvas.nativeElement.style.top = coords[1] + 'px';
      canvas.nativeElement.width = coords[2] - coords[0];
      canvas.nativeElement.height = coords[3] - coords[1];

      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = outlineStyle;
      ctx.fillRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height);
      ctx.strokeRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height);

    } else if (shape.toLowerCase() === 'circle') {
      canvas.nativeElement.style.left = (coords[0] - coords[2]) + 'px';
      canvas.nativeElement.style.top = (coords[1] - coords[2]) + 'px';
      canvas.nativeElement.width = 2 * (+coords[2] + 1);
      canvas.nativeElement.height = 2 * (+coords[2] + 1);

      ctx.beginPath();
      ctx.arc(canvas.nativeElement.width / 2, canvas.nativeElement.height / 2, coords[2], 0, 2 * Math.PI, true);
      ctx.closePath();

      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = outlineStyle;
      ctx.fill();
      ctx.stroke();

    } else if (shape.toLowerCase() === 'poly') {
      const size = coords.length;
      if (size < 3) { return; }

      const evenCoords: number[] = [];
      const oddCoords: number[] = [];

      coords.filter(function(coord, i) {
        const coordinate = +(coord.toString().trim());
        i % 2 === 0 ? evenCoords.push(coordinate) : oddCoords.push(coordinate);
      });

      canvas.nativeElement.width = evenCoords.reduce(function(a, b) {
        return Math.max(a, b);
      });

      canvas.nativeElement.height = oddCoords.reduce(function(a, b) {
        return Math.max(a, b);
      });

      ctx.beginPath();
      ctx.moveTo(coords[0], coords[1]);
      for (let i = 2; i < size; i += 2) {
        ctx.lineTo(coords[i], coords[i + 1]);
      }
      ctx.lineTo(coords[0], coords[1]);
      ctx.closePath();

      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = outlineStyle;
      ctx.fill();
      ctx.stroke();
    }
  }

  private getHoverFillColour(currentArea: ElementRef, elementDrawStyle: any): string {
    let hoverColor;
    if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.hoverFill) &&
      this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.hoverFill.value)) {
      hoverColor = currentArea.nativeElement.attributes.hoverFill.value;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.hoverFill)) {
      hoverColor = elementDrawStyle.hoverFill;
    } else {
      hoverColor = this.hoverDefaultColour;
    }

    return hoverColor;
  }

  private getOutlineColour(currentArea: ElementRef, elementDrawStyle: any): string {
    let outlineColor;
    if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.outline) &&
      this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.outline.value)) {
      outlineColor = currentArea.nativeElement.attributes.outline.value;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.outline)) {
      outlineColor = elementDrawStyle.outline;
    } else {
      outlineColor = this.borderDefaultColour;
    }

    return outlineColor;
  }

  private getSelectedFillColour(currentArea: ElementRef, elementDrawStyle: any): string {
    let filledColor;
    if (this.utilityService.isValidInstance(currentArea.nativeElement.attributes.selectedFill) &&
      this.utilityService.isNotEmptyString(currentArea.nativeElement.attributes.selectedFill.value)) {
      filledColor = currentArea.nativeElement.attributes.selectedFill.value;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.selectedFill)) {
      filledColor = elementDrawStyle.selectedFill;
    } else {
      filledColor = this.filledDefaultColour;
    }

    return filledColor;
  }
}
