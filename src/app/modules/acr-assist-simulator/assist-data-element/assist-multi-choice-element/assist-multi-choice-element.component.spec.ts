import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistMultiChoiceElementComponent } from './assist-multi-choice-element.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HintDiagramComponent } from '../hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../image-map/image-map.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { MultiChoiceDataElement } from '../../../core/elements/models/multi-choice-data-element';
import { ChoiceInfo } from '../../../core/elements/models/choiceInfo.model';
import { Choice } from '../../../core/elements/models/choice.model';
import { MultiChoiceElement } from '../assist-data-element.component';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';

describe('AssistMultiChoiceElementComponent', () => {
  let component: AssistMultiChoiceElementComponent;
  let fixture: ComponentFixture<AssistMultiChoiceElementComponent>;
  let nativeElement: any;
  let multiChoiceDataElement: ChoiceDataElement;
  let receivedData: any;
  let choice: Choice;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistMultiChoiceElementComponent, HintDiagramComponent, ImageMapComponent, SlideComponent, CarouselComponent ],
      providers: [CarouselConfig, SimulatorEngineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(AssistMultiChoiceElementComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement.nativeElement;

    component.multiChoiceElement = new MultiChoiceDataElement();

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement =  undefined;
    multiChoiceDataElement = undefined;
    receivedData = undefined;
    choice = undefined;
  });

  function setDataElements(currentValue) {
    const dataElements = Array<BaseDataElement>();

    multiChoiceDataElement = new ChoiceDataElement();
    multiChoiceDataElement.cdeId = '100';
    multiChoiceDataElement.currentValue = currentValue;
    multiChoiceDataElement.dataElementType = 'MultiChoiceDataElement';
    multiChoiceDataElement.defaultValue = undefined;
    multiChoiceDataElement.displaySequence = 1;
    multiChoiceDataElement.hint = undefined;
    multiChoiceDataElement.id = 'levelsinvolved';
    multiChoiceDataElement.isRequired = true;
    multiChoiceDataElement.isVisible = true;
    multiChoiceDataElement.label = 'Which levels involved?';

    multiChoiceDataElement.choiceInfo = [];

    choice = new Choice();
    choice.label = 'I';
    choice.value = 'I';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    multiChoiceDataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'II';
    choice.value = 'II';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    multiChoiceDataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'III';
    choice.value = 'III';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    multiChoiceDataElement.choiceInfo.push(choice);

    dataElements.push(multiChoiceDataElement);

    component.multiChoiceElement = <MultiChoiceDataElement>dataElements[0];
    // component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  it('Created the AssistMultiChoiceElementComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Called ngAfterViewInit() method with invalid value', () => {
    setDataElements(undefined);

    component.returnMultiChoice.subscribe(data => {
      receivedData = data;
     });

    component.ngAfterViewInit();

    expect(receivedData).toBeUndefined();
  });

  it('Called ngAfterViewInit() method with current values as array', () => {
    setDataElements(['I', 'II']);

    component.returnMultiChoice.subscribe(data => {
      receivedData = data;
     });

    component.ngAfterViewInit();

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof MultiChoiceElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();

    expect(receivedData.receivedElement.selectedTexts).toBeDefined();
    expect(receivedData.receivedElement.selectedTexts).toBeTruthy();

    expect(receivedData.receivedElement.selectedValues).toBeDefined();
    expect(receivedData.receivedElement.selectedValues).toBeTruthy();

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.multiChoiceElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.multiChoiceElement.id);

    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
  });

  it('Called ngAfterViewInit() method with current values as non array', () => {
    setDataElements('I');

    component.returnMultiChoice.subscribe(data => {
      receivedData = data;
     });

    component.ngAfterViewInit();

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof MultiChoiceElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();

    expect(receivedData.receivedElement.selectedTexts).toBeDefined();
    expect(receivedData.receivedElement.selectedTexts).toBeTruthy();

    expect(receivedData.receivedElement.selectedValues).toBeDefined();
    expect(receivedData.receivedElement.selectedValues).toBeTruthy();

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.multiChoiceElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.multiChoiceElement.id);

    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
  });

  it('MultiChoiceDataElement shows isRequired during the initial load', () => {
    setDataElements('I');
    component.ngOnInit();

    const multiChoiceElement = component.multiChoiceElementForm.controls['multiCheckBox'];
    const errors = multiChoiceElement.errors || {};

    expect(multiChoiceElement.invalid).toBeTruthy();
    expect(errors['notEquivalent']).toBeTruthy();
  });

  it('MultiChoiceDataElement removes isRequired during the value intialization', () => {
    component.ngOnInit();

    const multiChoiceElement = component.multiChoiceElementForm.controls['multiCheckBox'];
    multiChoiceElement.setValue('I');

    expect(multiChoiceElement.valid).toBeTruthy();
    expect(multiChoiceElement.errors).toBeNull();
  });

  it('Called updateMultiChoice(elementId: string, selectedCondition: string, value: string, event)' +
  ' method with valid value and checked as true', () => {
    setDataElements('I');
    const event = { currentTarget : { checked: true, value: component.multiChoiceElement.choiceInfo[0].value }};
    const id = component.multiChoiceElement.id;
    const label = component.multiChoiceElement.label;
    const choiceLabel = component.multiChoiceElement.choiceInfo[0].label;

    component.returnMultiChoice.subscribe(data => {
      receivedData = data;
     });

    component.updateMultiChoice(id, label, choiceLabel, event);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the multiChoiceValues
    expect(component.multiChoiceValues).toBeDefined();
    expect(component.multiChoiceValues).toBeTruthy();
    expect(component.multiChoiceValues[0]).toEqual(component.multiChoiceElement.choiceInfo[0].value);

    // Checks the multiChoiceComaprisonValues
    expect(component.multiChoiceComaprisonValues).toBeDefined();
    expect(component.multiChoiceComaprisonValues).toBeTruthy();
    expect(component.multiChoiceComaprisonValues[0]).toEqual(component.multiChoiceElement.choiceInfo[0].value);

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof MultiChoiceElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();

    expect(receivedData.receivedElement.selectedTexts).toBeDefined();
    expect(receivedData.receivedElement.selectedTexts).toBeTruthy();

    expect(receivedData.receivedElement.selectedValues).toBeDefined();
    expect(receivedData.receivedElement.selectedValues).toBeTruthy();

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.multiChoiceElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.multiChoiceElement.id);

    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
  });

  it('Called updateMultiChoice(elementId: string, selectedCondition: string, value: string, event)' +
  ' method with valid value and checked as false', () => {
    setDataElements('I');
    const event = { currentTarget : { checked: false, value: component.multiChoiceElement.choiceInfo[0].value }};
    const id = component.multiChoiceElement.id;
    const label = component.multiChoiceElement.label;
    const choiceLabel = component.multiChoiceElement.choiceInfo[0].label;

    component.returnMultiChoice.subscribe(data => {
      receivedData = data;
     });

    component.updateMultiChoice(id, label, choiceLabel, event);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof MultiChoiceElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.multiChoiceElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.multiChoiceElement.id);

    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
  });

  it('Called updateMultiChoice(elementId: string, selectedCondition: string, value: string, event)' +
  ' method with invalid value', () => {
    setDataElements('I');
    const event = { currentTarget : { checked: true, value: undefined }};

    component.returnMultiChoice.subscribe(data => {
      receivedData = data;
     });

    const updateMultiChoice = function () {
      try {
        component.updateMultiChoice(undefined, undefined, undefined, undefined);
      } catch (error) {
        throw error;
      }
    };

    expect(updateMultiChoice).toThrow();

    // Checks the received data
    expect(receivedData).toBeUndefined();
  });

  it('Called selectedMultiChoice(elementId: string, selectedCondition: string, choiceValue: string, choiceLabel)' +
  ' method with valid value and checked as false', () => {
    setDataElements('I');
    const id = component.multiChoiceElement.id;
    const label = component.multiChoiceElement.label;
    const choiceLabel = component.multiChoiceElement.choiceInfo[0].label;
    const value = component.multiChoiceElement.choiceInfo[0].value;

    component.returnMultiChoice.subscribe(data => {
      receivedData = data;
     });

    component.selectedMultiChoice(id, label, value, choiceLabel);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof MultiChoiceElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();

    // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.multiChoiceElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.multiChoiceElement.id);

    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
  });
});
