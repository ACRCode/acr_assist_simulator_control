import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UtilityService } from '../../../core/services/utility.service';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { ChoiceDataElement, MultiChoiceDataElement, Area } from 'testruleengine/Library/Models/Class';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ChoiceElementDisplayEnum } from '../../../core/models/choice-element-display.enum';
import { ChoiceControlStyle } from '../../../core/models/choice-control-style.model';
import { DomSanitizer } from '@angular/platform-browser';

declare var maphighlight: any;
declare var getAreasofImageMap: any;

@Component({
  selector: 'acr-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.css']
})
export class ImageMapComponent implements OnInit {

  selectionValue = '';
  map_selector_class = 'cursor-pointer map-selector';
  isOverlayLoading = false;
  selectedValues = [];
  hoverDefaultColour = '383b3c';
  filledDefaultColour = '28b36d';
  borderDefaultColour = '000000';
  config = {
    "fade": false,
    "alwaysOn": false,
    "neverOn": false,
    "fill": true,
    "fillColor": '383b3c',
    "fillOpacity": 0.5,
    "stroke": true,
    "strokeColor": '000000',
    "strokeOpacity": 1,
    "strokeWidth": 1,
    "shadow": true,
    "shadowColor": '#000000',
    "shadowOpacity": 0.8,
    "shadowRadius": "10"
  };
  @Input() elementDisplay: ChoiceElementDisplayEnum;

  @Input() dataElement: ChoiceDataElement | MultiChoiceDataElement;
  @Input() assetsBaseUrl: string;
  @ViewChild('modalPopup') modalPopup: ModalDirective;
  @ViewChild('image') image: ElementRef;
  // @ViewChildren('canvases') canvases: QueryList<ElementRef<HTMLCanvasElement>>;
  @Input() choiceControlStyle: ChoiceElementDisplayEnum;
  @Input() customizeChoiceControlById: ChoiceControlStyle[];

  constructor(
    private simulatorEngineService: SimulatorEngineService,
    private utilityService: UtilityService,
    private sanitizer : DomSanitizer
  ) {
  }

  ngOnInit() {
    this.selectedValues = [];
    // this.initializeSelectedOverlayData();
  }

  openImageMap() {
    this.modalPopup.show();
    this.isOverlayLoading = true;
  }

  initializeSelectedOverlayData() {
    // console.log("initialize overlay gets loaded");
    maphighlight(this.config, this.dataElement.id);
    const imageMapAreas = this.dataElement.imageMap?.map?.areas;
    if (this.utilityService.isValidInstance(imageMapAreas)) {        
      imageMapAreas.forEach(area => {
        if (!this.utilityService.isValidInstance(area.cachedCoords)) {
          area.cachedCoords = area.coords;
        }
        area.coords = this.getCoordinates(area.cachedCoords);
      });
    }
    setTimeout(() => {
      this.restoreSelectedOverlays(imageMapAreas);
      this.isOverlayLoading = false;
    }, 200);
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
    return Array.isArray(coordinates) ? coordinates.join(',') : coordinates;
  }

  getSelectedValues() {
    if (this.utilityService.isNotEmptyArray(this.selectedValues)) {
      return 'Selected Values : ' + this.selectedValues.join(' | ');
    } else {
      return 'Image Map Diagram';
    }
  }

  isValidImageURL(location: string) {
    return this.utilityService.isValidImageURL(location) || this.utilityService.isImageDataUrl(location);
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

  needToCustomizeTheControl(): ChoiceElementDisplayEnum {
    if (this.utilityService.isNotEmptyArray(this.customizeChoiceControlById)) {
      const selectedDataElementId = this.customizeChoiceControlById.find(x => x.dataElementId === this.dataElement.id);
      if (this.utilityService.isValidInstance(selectedDataElementId)) {
        return selectedDataElementId.ChoiceElementDisplay as ChoiceElementDisplayEnum;
      }

      return undefined;
    }

    return undefined;
  }

  _isRadioButton(): boolean {
    const needToCustomizeTheControl = this.needToCustomizeTheControl();
    if (undefined !== needToCustomizeTheControl && needToCustomizeTheControl === ChoiceElementDisplayEnum.RadioButton &&
      !this.isChoiceHasDiagrams(this.dataElement)) {
      return true;
    }

    if (this.choiceControlStyle === ChoiceElementDisplayEnum.RadioButton && !this.isChoiceHasDiagrams(this.dataElement)) {
      return true;
    }

    return !this.utilityService.isValidInstance(this.choiceControlStyle) && this.isRadioButton() &&
      !this.isChoiceHasDiagrams(this.dataElement);
  }

  isRadioButton(): boolean {
    return this.elementDisplay === ChoiceElementDisplayEnum.RadioButton;
  }

  _isListBox(): boolean {
    const needToCustomizeTheControl = this.needToCustomizeTheControl();
    if (undefined !== needToCustomizeTheControl && needToCustomizeTheControl === ChoiceElementDisplayEnum.ListBox &&
      !this.isChoiceHasDiagrams(this.dataElement)) {
      return true;
    }

    if (this.choiceControlStyle === ChoiceElementDisplayEnum.ListBox && !this.isChoiceHasDiagrams(this.dataElement)) {
      return true;
    }

    return !this.utilityService.isValidInstance(this.choiceControlStyle) && this.isListBox() && !this.isChoiceHasDiagrams(this.dataElement);
  }

  isListBox(): boolean {
    return this.elementDisplay === ChoiceElementDisplayEnum.ListBox;
  }

  _isSelectBox(): boolean {
    const needToCustomizeTheControl = this.needToCustomizeTheControl();
    if (undefined !== needToCustomizeTheControl && needToCustomizeTheControl === ChoiceElementDisplayEnum.SelectBox &&
      !this.isChoiceHasDiagrams(this.dataElement)) {
      return true;
    }

    if (this.choiceControlStyle === ChoiceElementDisplayEnum.SelectBox && !this.isChoiceHasDiagrams(this.dataElement)) {
      return true;
    }

    return !this.utilityService.isValidInstance(this.choiceControlStyle) && this.isSelectBox() &&
      !this.isChoiceHasDiagrams(this.dataElement);
  }

  isSelectBox(): boolean {
    return this.elementDisplay === ChoiceElementDisplayEnum.SelectBox;
  }

  setSelectedValue(index) {
    const imageMapAreas = this.dataElement.imageMap?.map?.areas;
    if (this.utilityService.isValidInstance(imageMapAreas)) {
      const area = imageMapAreas[index];
      if (this.utilityService.isValidInstance(area)) {
        if (this.utilityService.isNotEmptyString(area.choiceValue)) {
          this.updateSelectedOverlay(index, area);
          this.setSelectedValues(area.choiceValue);
        }
      }
    }
  }

  updateHoverOverlay(index, isAdd) {
    const imageMapAreas = this.dataElement.imageMap?.map?.areas;
    if (this.utilityService.isValidInstance(imageMapAreas)) {
      const area = imageMapAreas[index];
      if (this.utilityService.isValidInstance(area)) {
        const shape = area.shape;
        const coords = area.coords.split(',');
        // const canvas = this.canvases.toArray()[index];
        const elementDrawStyle = this.dataElement.imageMap.drawStyle;

        let hoverColor = this.getHoverFillColour(area.hoverFill, elementDrawStyle);
        const filledColor = this.getSelectedFillColour(area.selectedFill, elementDrawStyle);
        const outlineColor = this.getOutlineColour(area.outline, elementDrawStyle);

        if (hoverColor === filledColor) {
          hoverColor = this.hoverDefaultColour;
        }
        var areasList = $('area[choice]');
        
        var selArea = areasList[index];
        var data = $(selArea).data('maphilight') || {};
        if(!$(selArea).hasClass("selected")) {
          if(selArea != null && isAdd) {
            data.alwaysOn = true;
            data.fillColor = hoverColor;
            data.outlineColor = outlineColor;
            $(selArea).data('maphilight', data).trigger('alwaysOn.maphilight');
            // ;
          } else {
            data.alwaysOn = false;
            $(selArea).data('maphilight', data).trigger('alwaysOn.maphilight');
          }
        }

        // if (this.utilityService.isValidInstance(canvas)) {
        //   if (isAdd) {
        //     if (!canvas.nativeElement.className.includes('hover') && !canvas.nativeElement.className.includes('selected')) {
        //       canvas.nativeElement.style.position = 'absolute';
        //       canvas.nativeElement.style.display = 'block';
        //       canvas.nativeElement.className += ' hover';
        //       this.drawStyleBasedOnShape(canvas, hoverColor, outlineColor, shape, coords);
        //     }
        //   } else {
        //     if (!canvas.nativeElement.className.includes('selected')) {
        //       canvas.nativeElement.style.position = '';
        //       canvas.nativeElement.style.display = 'none';
        //     }
        //     canvas.nativeElement.className = canvas.nativeElement.className.replace('hover', '').trim();
        //   }
        // }
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
          // if (this.dataElement.choiceInfo.length <= 2 && this.dataElement.choiceInfo.length > 0) {
          //   $('#' + choice.value + '_' + this.dataElement.id).prop('checked', true);
          //   $('#' + choice.value + '_' + this.dataElement.id)[0].dispatchEvent(customEvent);
          // } else {
          //   $('#' + this.dataElement.id).val(choice.value);
          //   $('#' + this.dataElement.id)[0].dispatchEvent(customEvent);
          // }
          if (this._isListBox() || this._isSelectBox()) {
            $('#' + this.dataElement.id).val(choice.value);
            $('#' + this.dataElement.id)[0].dispatchEvent(customEvent);
            this.modalPopup.hide();
          } else if (this._isRadioButton()) {
            // $('#' + choice.value + '_' + this.dataElement.id).addClass('highlightchoice')
            // $('#' + choice.value + '_' + this.dataElement.id).prop('checked', true);
            $("[id$='_" + this.dataElement.id + "']").removeClass('highlightchoice');
            $('#' + choice.value + '_' + this.dataElement.id).addClass('highlightchoice');
            $("[id$='_" + this.dataElement.id + "']").find('input[type=radio]').prop("checked", false);
            $('#' + choice.value).attr("checked", "true");
            $('#' + choice.value + '_' + this.dataElement.id).trigger('click');
            // $('#' + choice.value).dispatchEvent(customEvent);
            $('#' + choice.value + '_' + this.dataElement.id)[0].dispatchEvent(customEvent);
            this.modalPopup.hide();
          }
        } else {
          $("[id$='_" + this.dataElement.id + "']").removeClass('highlightchoice');
          $('#' + choice.value + '_' + this.dataElement.id).addClass('highlightchoice');
          $("[id$='_" + this.dataElement.id + "']").find('input[type=radio]').prop("checked", false);
          $('#' + choice.value).attr("checked", "true");
          // $('#' + choice.value + '_' + this.dataElement.id).prop('checked', true);
          // $('#' + choice.value).dispatchEvent(customEvent);
          $('#' + choice.value + '_' + this.dataElement.id).trigger('click');
          $('#' + choice.value + '_' + this.dataElement.id)[0].dispatchEvent(customEvent);
          this.modalPopup.hide();
        }
        // this.modalPopup.hide();
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

  private restoreSelectedOverlays(imageMapAreas: Area[]) {
    
    const values = this.simulatorEngineService.getAllDataElementValues().get(this.dataElement.id);
    if (Array.isArray(values) && this.utilityService.isNotEmptyArray(values)) {
      this.selectedValues = values;
    }
    var dataElementId = '#image_map_' + this.dataElement.id;
    var areasList = getAreasofImageMap(dataElementId);
    for (let index = 0; index < imageMapAreas.length; index++) {
      if (this.utilityService.isValidInstance(imageMapAreas)) {
        let hasValueSelected = false;
        if (this.utilityService.isNotEmptyArray(values)) {
          if (Array.isArray(values)) {
            hasValueSelected = values.indexOf(imageMapAreas[index].choiceValue) >= 0;
          } else {
            hasValueSelected = values === imageMapAreas[index].choiceValue;
          }
        }
        var imageSizeCSSClass = {};
        imageSizeCSSClass["max-width"] = this.image.nativeElement.width;
        imageSizeCSSClass["max-height"] = this.image.nativeElement.height;
        $(".img-responsive").css(imageSizeCSSClass);

        var selArea = areasList[index];
        var data = $(selArea).data('maphilight') || {};
        if(hasValueSelected) {
          const area = imageMapAreas[index];
          // const shape = area.shape;
          // const coords = area.coords.split(',');
          // const canvas = this.canvases.toArray()[index];
          const elementDrawStyle = this.dataElement.imageMap.drawStyle;
          // for(var i = 0; i < areasList.length; i++) {
          
          data.alwaysOn = true;
          data.fillColor = this.getSelectedFillColour(area.selectedFill, elementDrawStyle);
          data.strokeColor = this.getOutlineColour(area.outline, elementDrawStyle);
          $(selArea).data('maphilight', data).trigger('alwaysOn.maphilight');
          $(selArea).addClass("selected");
        } else {
          data.alwaysOn = false;
          $(selArea).data('maphilight', data).trigger('alwaysOn.maphilight');
          $(selArea).removeClass("selected");
        }
        // const filledColor = this.getSelectedFillColour(area.selectedFill, elementDrawStyle);
        // const outlineColor = this.getOutlineColour(area.outline, elementDrawStyle);

        // if (this.utilityService.isValidInstance(canvas)) {
        //   if (canvas.nativeElement.className.includes('hover') || canvas.nativeElement.className.includes('selected')) {
        //     canvas.nativeElement.style.position = '';
        //     canvas.nativeElement.style.display = 'none';
            // canvas.nativeElement.className = this.map_selector_class;
          // }
        //   if (hasValueSelected) {
        //     canvas.nativeElement.style.position = 'absolute';
        //     canvas.nativeElement.style.display = 'block';

        //     this.drawStyleBasedOnShape(canvas, filledColor, outlineColor, shape, coords);
        //     canvas.nativeElement.className = this.map_selector_class + ' selected';
        //   }
        // }    
      }
    }
  }

  private updateSelectedOverlay(index: number, area: Area) {
    const coords = area.coords.split(',');
    const shape = area.shape;
    // const canvas = this.canvases.toArray()[index];
    const elementDrawStyle = this.dataElement.imageMap.drawStyle;

    const filledColor = this.getSelectedFillColour(area.selectedFill, elementDrawStyle);
    const outlineColor = this.getOutlineColour(area.outline, elementDrawStyle);

    if (this.dataElement.dataElementType !== 'MultiChoiceDataElement') {
      this.RemoveSelection();
    }
    var areasList = $('area[choice]');
    var selArea = areasList[index];
    var data = $(selArea).data('maphilight') || {};
    if(selArea != null && !$(selArea).hasClass("selected")) {
      data.alwaysOn = true;
      data.fillColor = filledColor;
      data.outlineColor = outlineColor;
      $(selArea).data('maphilight', data).trigger('alwaysOn.maphilight');
      $(selArea).addClass("selected");
    } else {
      data.alwaysOn = false;
      $(selArea).data('maphilight', data).trigger('alwaysOn.maphilight');
      $(selArea).removeClass("selected");
    }

    // if (this.utilityService.isValidInstance(canvas)) {
    //   if (canvas.nativeElement.className.includes('selected')) {
    //     canvas.nativeElement.style.position = '';
    //     canvas.nativeElement.style.display = 'none';
    //     canvas.nativeElement.className = this.map_selector_class;
    //   } else {
    //     canvas.nativeElement.style.position = 'absolute';
    //     canvas.nativeElement.style.display = 'block';

    //     this.drawStyleBasedOnShape(canvas, filledColor, outlineColor, shape, coords);
    //     canvas.nativeElement.className = this.map_selector_class + ' selected';
    //   }
    // }
  }

  RemoveSelection() {
    var selectedArea = $("area.selected");
    var data = $(selectedArea).data('maphilight') || {};
    data.alwaysOn = false;
    $(selectedArea).data('maphilight', data).trigger('alwaysOn.maphilight');
    $(selectedArea).removeClass("selected");

    // this.canvases.forEach(x => {
    //   if (x.nativeElement.className.includes('selected')) {
    //     x.nativeElement.style.position = '';
    //     x.nativeElement.style.display = 'none';
    //     x.nativeElement.className = this.map_selector_class;
    //   }
    // });
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

      coords.filter(function (coord, i) {
        const coordinate = +(coord.toString().trim());
        i % 2 === 0 ? evenCoords.push(coordinate) : oddCoords.push(coordinate);
      });

      canvas.nativeElement.width = evenCoords.reduce(function (a, b) {
        return Math.max(a, b);
      });

      canvas.nativeElement.height = oddCoords.reduce(function (a, b) {
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

  private getHoverFillColour(hoverFill: string, elementDrawStyle: any): string {
    let hoverColor;
    if (this.utilityService.isNotEmptyString(hoverFill)) {
      hoverColor = hoverFill;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.hoverFill)) {
      hoverColor = elementDrawStyle.hoverFill;
    } else {
      hoverColor = this.hoverDefaultColour;
    }

    return hoverColor;
  }

  private getOutlineColour(outline: string, elementDrawStyle: any): string {
    let outlineColor;
    if (this.utilityService.isNotEmptyString(outline)) {
      outlineColor = outline;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.outline)) {
      outlineColor = elementDrawStyle.outline;
    } else {
      outlineColor = this.borderDefaultColour;
    }

    return outlineColor;
  }

  private getSelectedFillColour(selectedFill: string, elementDrawStyle: any): string {
    let filledColor;
    if (this.utilityService.isNotEmptyString(selectedFill)) {
      filledColor = selectedFill;
    } else if (this.utilityService.isValidInstance(elementDrawStyle) &&
      this.utilityService.isNotEmptyString(elementDrawStyle.selectedFill)) {
      filledColor = elementDrawStyle.selectedFill;
    } else {
      filledColor = this.filledDefaultColour;
    }

    return filledColor;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.initializeSelectedOverlayData();
  }
}
