import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMapComponent } from './image-map.component';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { Choice } from '../../../core/elements/models/choice.model';
import { Area } from '../../../core/elements/models/area-model';
import { ImageMap } from '../../../core/elements/models/image-map.model';
import { AreaMap } from '../../../core/elements/models/area-map.model';
import { By } from '@angular/platform-browser';

describe('ImageMapComponent', () => {
  let component: ImageMapComponent;
  let fixture: ComponentFixture<ImageMapComponent>;
  let dataElement: ChoiceDataElement;
  let choice: Choice;
  let area: Area;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMapComponent);
    component = fixture.componentInstance;
    component.DataElement = new ChoiceDataElement();
    fixture.detectChanges();
  });

  afterEach(() => {
    dataElement = undefined;
    choice = undefined;
    area = undefined;
  });

  function createDataElement() {
    dataElement = new ChoiceDataElement();
    dataElement.cdeId = '100';
    dataElement.currentValue = undefined;
    dataElement.dataElementType = 'ChoiceDataElement';
    dataElement.defaultValue = undefined;
    dataElement.displaySequence = 1;
    dataElement.hint = undefined;
    dataElement.id = 'LOCATION';
    dataElement.isRequired = true;
    dataElement.isVisible = true;
    dataElement.label = 'LOCATION';

    dataElement.choiceInfo = [];

    choice = new Choice();
    choice.label = 'Rigid spine';
    choice.value = 'rigidspine';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    dataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'Semi-rigid spine';
    choice.value = 'semi-rigidspine';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    dataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'Mobile spine';
    choice.value = 'mobilespine';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    dataElement.choiceInfo.push(choice);

    const imageMap = new ImageMap();
    imageMap.location = 'washoutImages.png';
    imageMap.label = 'Washout';
    imageMap.map = new AreaMap();
    imageMap.map.areas = [];

    area = new Area();
    area.choiceValue = 'no';
    area.coords = '243,47,630,65';
    area.shape = 'rect';
    imageMap.map.areas.push(area);

    area = new Area();
    area.choiceValue = 'yes';
    area.coords = '243,47,630';
    area.shape = 'circle';
    imageMap.map.areas.push(area);

    area = new Area();
    area.choiceValue = 'yes';
    area.coords = '1, 167, 10, 80, 50, 50';
    area.shape = 'poly';
    imageMap.map.areas.push(area);

    dataElement.imageMap = imageMap;
    component.DataElement = dataElement;
    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  it('Created the ImageMapComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Called ngOnInit() with undefined data elements', () => {
    component.DataElement = undefined;
    component.ngOnInit();
    expect(component.SelectionValue).toEqual('Image Map Diagram');
  });

  it('Called ngOnInit() with valid data elements', () => {
    createDataElement();
    component.ngOnInit();
    expect(component.SelectionValue).toEqual('Image Map Diagram');
  });

  it('Called displayValue(val) with empty value', () => {
    component.displayValue('');
    expect(component.SelectionValue).toEqual('Image Map Diagram');
  });

  it('Called displayValue(val) with valid value', () => {
    const value = 'test';
    component.displayValue('test');
    expect(component.SelectionValue).toEqual('Selected Value : ' + value);
  });

  it('Called isInRectangle(mouseX, mouseY, Coordinates) to draw rectangle with valid coordinates', () => {
    const result = component.isInRectangle(300, 166, '243,47,630,65');
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });

  it('Called isInRectangle(mouseX, mouseY, Coordinates) to draw rectangle with empty coordinates', () => {
    const result = component.isInRectangle(260, 110, '0, 0, 0 , 0');
    expect(result).toBeDefined();
    expect(result).toBeFalsy();
  });

  it('Called isInCircle(mouseX, mouseY, Coordinates) to draw circle with valid coordinates', () => {
    const result = component.isInCircle(300, 166, '243,47,630');
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });

  it('Called isInCircle(mouseX, mouseY, Coordinates) to draw circle with empty coordinates', () => {
    const result = component.isInCircle(260, 110, '0, 0, 0');
    expect(result).toBeDefined();
    expect(result).toBeFalsy();
  });

  it('Called isInPolygon(mouseX, mouseY, Coordinates) to draw polygon with valid coordinates', () => {
    const result = component.isInPolygon(0, 166, '1, 167, 10, 80, 50, 50');
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });

  it('Called isInPolygon(mouseX, mouseY, Coordinates) to draw polygon with empty coordinates', () => {
    const result = component.isInPolygon(260, 110, '0, 0, 0, 0, 0, 0');
    expect(result).toBeDefined();
    expect(result).toBeFalsy();
  });

});
