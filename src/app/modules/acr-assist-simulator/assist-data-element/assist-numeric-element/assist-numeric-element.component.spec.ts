import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistNumericElementComponent } from './assist-numeric-element.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HintDiagramComponent } from '../hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../image-map/image-map.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';
import { NumericElement } from '../assist-data-element.component';
import { SelectedCondition } from '../../../core/models/executed-result.model';

describe('AssistNumericElementComponent', () => {
  let component: AssistNumericElementComponent;
  let fixture: ComponentFixture<AssistNumericElementComponent>;
  let nativeElement: any;
  let numericDataElement: NumericDataElement;
  let receivedData: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistNumericElementComponent, HintDiagramComponent, ImageMapComponent, SlideComponent, CarouselComponent],
      providers: [CarouselConfig, SimulatorEngineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(AssistNumericElementComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement.nativeElement;

    component.numericDataElement = new NumericDataElement();

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement =  undefined;
    numericDataElement = undefined;
    receivedData = undefined;
  });

  function setDataElements(currentValue) {
    numericDataElement = new NumericDataElement();
    numericDataElement.cdeId = '100';
    numericDataElement.currentValue = currentValue;
    numericDataElement.dataElementType = 'IntegerDataElement';
    numericDataElement.defaultValue = undefined;
    numericDataElement.displaySequence = 1;
    numericDataElement.hint = 'Points assigned to feature';
    numericDataElement.id = 'SPINALINSTABILITYNEOPLASTICSCORE';
    numericDataElement.isRequired = true;
    numericDataElement.isVisible = true;
    numericDataElement.label = 'SPINAL INSTABILITY NEOPLASTIC SCORE';
    numericDataElement.minimum = 1;
    numericDataElement.maximum = 20;

    component.numericDataElement = numericDataElement;
    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  it('Created the AssistNumericElementComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Called ngAfterViewInit() method with invalid value', () => {
    setDataElements(undefined);

    component.returnNumericElement.subscribe(data => {
      receivedData = data;
     });

    component.ngAfterViewInit();

    expect(receivedData).toBeUndefined();
  });

  it('NumericElement shows isRequired during the initial load', () => {
    component.ngOnInit();

    const numericElement = component.numericElementForm.controls['numericElement'];
    const errors = numericElement.errors || {};

    expect(numericElement.invalid).toBeTruthy();
    expect(errors['required']).toBeTruthy();
  });

  it('NumericElement removes isRequired during the value intialization', () => {
    component.ngOnInit();

    const numericElement = component.numericElementForm.controls['numericElement'];
    numericElement.setValue(5);

    expect(numericElement.valid).toBeTruthy();
    expect(numericElement.errors).toBeNull();
  });

  it('Called choiceSelected(element, selectedCondition) method with valid value', () => {
    setDataElements(5);
    const event = { id: component.numericDataElement.id, value: component.numericDataElement.currentValue };

    component.returnNumericElement.subscribe(data => {
      receivedData = data;
     });

    component.choiceSelected(event, component.numericDataElement.label);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof NumericElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();
    expect(receivedData.receivedElement.elementId).toEqual(component.numericDataElement.id);
    expect(receivedData.receivedElement.selectedValue).toBeDefined();
    expect(receivedData.receivedElement.selectedValue).toBeTruthy();
    expect(receivedData.receivedElement.selectedValue).toBe(component.numericDataElement.currentValue);

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.numericDataElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.numericDataElement.id);
    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
    expect(receivedData.selectedCondition.selectedValue).toEqual(component.numericDataElement.currentValue);

  });

  it('Called choiceSelected(element, selectedCondition) method with invalid value', () => {
    setDataElements(5);
    const event = { id: undefined, value: undefined };

    component.returnNumericElement.subscribe(data => {
      receivedData = data;
     });

    component.choiceSelected(event, undefined);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof NumericElement);
    expect(receivedData.receivedElement.elementId).toBeUndefined();
    expect(receivedData.receivedElement.selectedValue).toBeUndefined();

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeUndefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeUndefined();
    expect(receivedData.selectedCondition.selectedValue).toBeUndefined();
  });

  it('Called loadedNumericValue(id, value, selectedCondition) method with valid value', () => {
    setDataElements(5);
    const id = component.numericDataElement.id;
    const value = component.numericDataElement.currentValue;
    const label = component.numericDataElement.label;

    component.returnNumericElement.subscribe(data => {
      receivedData = data;
     });

    component.loadedNumericValue(id, value, label);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof NumericElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();
    expect(receivedData.receivedElement.elementId).toEqual(component.numericDataElement.id);
    expect(receivedData.receivedElement.selectedValue).toBeDefined();
    expect(receivedData.receivedElement.selectedValue).toBeTruthy();
    expect(receivedData.receivedElement.selectedValue).toBe(component.numericDataElement.currentValue);

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.numericDataElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.numericDataElement.id);
    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
    expect(receivedData.selectedCondition.selectedValue).toEqual(component.numericDataElement.currentValue);
  });

  it('Called loadedNumericValue(id, value, selectedCondition) method with invalid value', () => {
    setDataElements(5);
    component.returnNumericElement.subscribe(data => {
      receivedData = data;
     });

    component.loadedNumericValue(undefined, undefined, undefined);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof NumericElement);
    expect(receivedData.receivedElement.elementId).toBeUndefined();
    expect(receivedData.receivedElement.selectedValue).toBeUndefined();

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeUndefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeUndefined();
    expect(receivedData.selectedCondition.selectedValue).toBeUndefined();
  });
});
