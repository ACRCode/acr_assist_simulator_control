import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistChoiceElementComponent } from './assist-choice-element.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HintDiagramComponent } from '../hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../image-map/image-map.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { Choice } from '../../../core/elements/models/choice.model';
import { ChoiceElement } from '../assist-data-element.component';
import { SelectedCondition } from '../../../core/models/executed-result.model';

describe('AssistChoiceElementComponent', () => {
  let component: AssistChoiceElementComponent;
  let fixture: ComponentFixture<AssistChoiceElementComponent>;
  let nativeElement: any;
  let choiceDataElement: ChoiceDataElement;
  let receivedData: any;
  let choice: Choice;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistChoiceElementComponent, HintDiagramComponent, ImageMapComponent, CarouselComponent, SlideComponent ],
      providers: [CarouselConfig, SimulatorEngineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(AssistChoiceElementComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement.nativeElement;

    component.choiceDataElement = new ChoiceDataElement();
    component.choiceDataElement.choiceInfo = [];

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement =  undefined;
    choiceDataElement = undefined;
    receivedData = undefined;
    choice = undefined;
  });

  function setDataElements(currentValue) {
    choiceDataElement = new ChoiceDataElement();
    choiceDataElement.cdeId = '100';
    choiceDataElement.currentValue = currentValue;
    choiceDataElement.dataElementType = 'ChoiceDataElement';
    choiceDataElement.defaultValue = undefined;
    choiceDataElement.displaySequence = 1;
    choiceDataElement.hint = undefined;
    choiceDataElement.id = 'LOCATION';
    choiceDataElement.isRequired = true;
    choiceDataElement.isVisible = true;
    choiceDataElement.label = 'LOCATION';

    choiceDataElement.choiceInfo = [];

    choice = new Choice();
    choice.label = 'Rigid spine';
    choice.value = 'rigidspine';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    choiceDataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'Semi-rigid spine';
    choice.value = 'semi-rigidspine';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    choiceDataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'Mobile spine';
    choice.value = 'mobilespine';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    choiceDataElement.choiceInfo.push(choice);

    component.choiceDataElement = choiceDataElement;
    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  it('Created the AssistChoiceElementComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Called ngAfterViewInit() method with invalid value', () => {
    setDataElements(undefined);

    component.returnChoiceElement.subscribe(data => {
      receivedData = data;
     });

    component.ngAfterViewInit();

    expect(receivedData).toBeUndefined();
  });

  it('MultiChoiceDataElement shows isRequired during the initial load', () => {
    setDataElements('rigidspine');
    component.ngOnInit();

    const choiceElement = component.choiceElementForm.controls['checkBox'];
    const errors = choiceElement.errors || {};

    expect(choiceElement.invalid).toBeTruthy();
    expect(errors['notEquivalent']).toBeTruthy();
  });

  it('MultiChoiceDataElement removes isRequired during the value intialization', () => {
    component.ngOnInit();

    const choiceElement = component.choiceElementForm.controls['checkBox'];
    component.choiceValue = 'rigidspine';
    choiceElement.setValue('rigidspine');

    expect(choiceElement.valid).toBeTruthy();
    expect(choiceElement.errors).toBeNull();
  });

  it('Called dropdownChoiceSelected(element, selectedCondition) method with valid value', () => {
    setDataElements('rigidspine');
    component.choiceValue = 'rigidspine';

    const event = { id: component.choiceDataElement.id, value: component.choiceDataElement.choiceInfo[0].value, selectedIndex: 0,
                    options: [ { text: component.choiceDataElement.choiceInfo[0].label } ] };

    component.returnChoiceElement.subscribe(data => {
      receivedData = data;
     });

    component.dropdownChoiceSelected(event, component.choiceDataElement.label);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof ChoiceElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();

    expect(receivedData.receivedElement.selectedText).toBeDefined();
    expect(receivedData.receivedElement.selectedText).toBeTruthy();
    expect(receivedData.receivedElement.selectedText).toEqual(component.choiceDataElement.choiceInfo[0].label);

    expect(receivedData.receivedElement.selectedValue).toBeDefined();
    expect(receivedData.receivedElement.selectedValue).toBeTruthy();
    expect(receivedData.receivedElement.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].value);

    // // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.choiceDataElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.choiceDataElement.id);

    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
    expect(receivedData.selectedCondition.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].label);
  });

  it('Called dropdownChoiceSelected(element, selectedCondition) method with invalid value', () => {
    component.choiceValue = 'rigidspine';

    const event = { id: undefined, value: undefined, selectedIndex: 0,
      options: [ { text: undefined } ] };

    component.returnChoiceElement.subscribe(data => {
      receivedData = data;
     });

    component.dropdownChoiceSelected(event, undefined);

     // Checks the received data
      expect(receivedData).toBeDefined();
      expect(receivedData).toBeTruthy();

      // Checks the received element of received data
      expect(receivedData.receivedElement).toBeDefined();
      expect(receivedData.receivedElement).toBeTruthy();

      expect(receivedData.receivedElement instanceof ChoiceElement);
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

  it('Called updateDropdownChoiceSelected(elementId, elementLabel, elementValue, selectedCondition) method with valid value', () => {
    setDataElements('rigidspine');
    component.choiceValue = 'rigidspine';

    const id = component.choiceDataElement.id;
    const label = component.choiceDataElement.label;
    const chocieLabel = component.choiceDataElement.choiceInfo[0].label;
    const value = component.choiceDataElement.choiceInfo[0].value;

    component.returnChoiceElement.subscribe(data => {
      receivedData = data;
     });

    component.setChoiceValue(id, chocieLabel, value, label);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof ChoiceElement);
    expect(receivedData.receivedElement.elementId).toBeDefined();
    expect(receivedData.receivedElement.elementId).toBeTruthy();

    expect(receivedData.receivedElement.selectedText).toBeDefined();
    expect(receivedData.receivedElement.selectedText).toBeTruthy();
    expect(receivedData.receivedElement.selectedText).toEqual(component.choiceDataElement.choiceInfo[0].label);

    expect(receivedData.receivedElement.selectedValue).toBeDefined();
    expect(receivedData.receivedElement.selectedValue).toBeTruthy();
    expect(receivedData.receivedElement.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].value);

    // // Checks the selectedCondition of received data
    expect(receivedData.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition).toBeTruthy();

    expect(receivedData.selectedCondition instanceof SelectedCondition);

    expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
    expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
    expect(receivedData.selectedCondition.selectedCondition).toEqual(component.choiceDataElement.label);

    expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
    expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
    expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.choiceDataElement.id);

    expect(receivedData.selectedCondition.selectedValue).toBeDefined();
    expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
    expect(receivedData.selectedCondition.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].label);
  });

  it('Called updateDropdownChoiceSelected(elementId, elementLabel, elementValue, selectedCondition) method with invalid value', () => {
    component.choiceValue = 'rigidspine';

    component.returnChoiceElement.subscribe(data => {
      receivedData = data;
    });

    component.setChoiceValue(undefined, undefined, undefined, undefined);

    // Checks the received data
    expect(receivedData).toBeDefined();
    expect(receivedData).toBeTruthy();

    // Checks the received element of received data
    expect(receivedData.receivedElement).toBeDefined();
    expect(receivedData.receivedElement).toBeTruthy();

    expect(receivedData.receivedElement instanceof ChoiceElement);
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

  it('Called choiceSelected(elementId: string, selectedElement: string, selectedText: string, selectedValue: string)' +
  ' method with valid value', () => {
      setDataElements('rigidspine');

      const id = component.choiceDataElement.id;
      const label = component.choiceDataElement.label;
      const chocieLabel = component.choiceDataElement.choiceInfo[0].label;
      const value = component.choiceDataElement.choiceInfo[0].value;

      component.returnChoiceElement.subscribe(data => {
        receivedData = data;
      });

      component.choiceSelected(id, label, chocieLabel, value);

      // Checks the received data
      expect(receivedData).toBeDefined();
      expect(receivedData).toBeTruthy();

      // // Checks the received element of received data
      expect(receivedData.receivedElement).toBeDefined();
      expect(receivedData.receivedElement).toBeTruthy();

      expect(receivedData.receivedElement instanceof ChoiceElement);
      expect(receivedData.receivedElement.elementId).toBeDefined();
      expect(receivedData.receivedElement.elementId).toBeTruthy();

      expect(receivedData.receivedElement.selectedText).toBeDefined();
      expect(receivedData.receivedElement.selectedText).toBeTruthy();
      expect(receivedData.receivedElement.selectedText).toEqual(component.choiceDataElement.choiceInfo[0].label);

      expect(receivedData.receivedElement.selectedValue).toBeDefined();
      expect(receivedData.receivedElement.selectedValue).toBeTruthy();
      expect(receivedData.receivedElement.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].value);

      // // Checks the selectedCondition of received data
      expect(receivedData.selectedCondition).toBeDefined();
      expect(receivedData.selectedCondition).toBeTruthy();

      expect(receivedData.selectedCondition instanceof SelectedCondition);

      expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
      expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
      expect(receivedData.selectedCondition.selectedCondition).toEqual(component.choiceDataElement.label);

      expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
      expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
      expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.choiceDataElement.id);

      expect(receivedData.selectedCondition.selectedValue).toBeDefined();
      expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
      expect(receivedData.selectedCondition.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].label);
    });

    it('Called choiceSelected(elementId: string, selectedElement: string, selectedText: string, selectedValue: string)' +
    ' method with invalid value', () => {

      component.returnChoiceElement.subscribe(data => {
        receivedData = data;
      });

      component.choiceSelected(undefined, undefined, undefined, undefined);

      // Checks the received data
      expect(receivedData).toBeDefined();
      expect(receivedData).toBeTruthy();

      // Checks the received element of received data
      expect(receivedData.receivedElement).toBeDefined();
      expect(receivedData.receivedElement).toBeTruthy();

      expect(receivedData.receivedElement instanceof ChoiceElement);
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

    it('Called updateChoiceValue(elementId: string, selectedElement: string, selectedText: string, selectedValue: string)' +
    ' method with valid value', () => {
      setDataElements('rigidspine');

      const id = component.choiceDataElement.id;
      const label = component.choiceDataElement.label;
      const chocieLabel = component.choiceDataElement.choiceInfo[0].label;
      const value = component.choiceDataElement.choiceInfo[0].value;

      component.returnChoiceElement.subscribe(data => {
        receivedData = data;
      });

      component.setChoiceValue(id, label, chocieLabel, value);

      // Checks the received data
      expect(receivedData).toBeDefined();
      expect(receivedData).toBeTruthy();

      // // Checks the received element of received data
      expect(receivedData.receivedElement).toBeDefined();
      expect(receivedData.receivedElement).toBeTruthy();

      expect(receivedData.receivedElement instanceof ChoiceElement);
      expect(receivedData.receivedElement.elementId).toBeDefined();
      expect(receivedData.receivedElement.elementId).toBeTruthy();

      expect(receivedData.receivedElement.selectedText).toBeDefined();
      expect(receivedData.receivedElement.selectedText).toBeTruthy();
      expect(receivedData.receivedElement.selectedText).toEqual(component.choiceDataElement.choiceInfo[0].label);

      expect(receivedData.receivedElement.selectedValue).toBeDefined();
      expect(receivedData.receivedElement.selectedValue).toBeTruthy();
      expect(receivedData.receivedElement.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].value);

      // // Checks the selectedCondition of received data
      expect(receivedData.selectedCondition).toBeDefined();
      expect(receivedData.selectedCondition).toBeTruthy();

      expect(receivedData.selectedCondition instanceof SelectedCondition);

      expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
      expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
      expect(receivedData.selectedCondition.selectedCondition).toEqual(component.choiceDataElement.label);

      expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
      expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
      expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.choiceDataElement.id);

      expect(receivedData.selectedCondition.selectedValue).toBeDefined();
      expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
      expect(receivedData.selectedCondition.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].label);
    });

    it('Called updateChoiceValue(elementId: string, selectedElement: string, selectedText: string, selectedValue: string)' +
    ' method with invalid value', () => {

      component.returnChoiceElement.subscribe(data => {
        receivedData = data;
      });

      component.setChoiceValue(undefined, undefined, undefined, undefined);

      // Checks the received data
      expect(receivedData).toBeDefined();
      expect(receivedData).toBeTruthy();

      // Checks the received element of received data
      expect(receivedData.receivedElement).toBeDefined();
      expect(receivedData.receivedElement).toBeTruthy();

      expect(receivedData.receivedElement instanceof ChoiceElement);
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

    it('Called updateFreeText (element, elementId, selectedCondition) with valid values', () => {
      setDataElements('rigidspine');

      const id = component.choiceDataElement.id;
      const label = component.choiceDataElement.label;
      const element = { value: component.choiceDataElement.choiceInfo[0].value };

      component.returnChoiceElement.subscribe(data => {
        receivedData = data;
      });

      component.updateFreeText(element, id, label);

      // Checks the received data
      expect(receivedData).toBeDefined();
      expect(receivedData).toBeTruthy();

      // // Checks the received element of received data
      expect(receivedData.receivedElement).toBeDefined();
      expect(receivedData.receivedElement).toBeTruthy();

      expect(receivedData.receivedElement instanceof ChoiceElement);
      expect(receivedData.receivedElement.elementId).toBeDefined();
      expect(receivedData.receivedElement.elementId).toBeTruthy();

      expect(receivedData.receivedElement.selectedText).toBeDefined();
      expect(receivedData.receivedElement.selectedText).toBeTruthy();
      expect(receivedData.receivedElement.selectedText).toEqual(component.choiceDataElement.choiceInfo[0].value);

      expect(receivedData.receivedElement.selectedValue).toBeDefined();
      expect(receivedData.receivedElement.selectedValue).toBeTruthy();
      expect(receivedData.receivedElement.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].value);

      // // Checks the selectedCondition of received data
      expect(receivedData.selectedCondition).toBeDefined();
      expect(receivedData.selectedCondition).toBeTruthy();

      expect(receivedData.selectedCondition instanceof SelectedCondition);

      expect(receivedData.selectedCondition.selectedCondition).toBeDefined();
      expect(receivedData.selectedCondition.selectedCondition).toBeTruthy();
      expect(receivedData.selectedCondition.selectedCondition).toEqual(component.choiceDataElement.label);

      expect(receivedData.selectedCondition.selectedConditionId).toBeDefined();
      expect(receivedData.selectedCondition.selectedConditionId).toBeTruthy();
      expect(receivedData.selectedCondition.selectedConditionId).toEqual(component.choiceDataElement.id);

      expect(receivedData.selectedCondition.selectedValue).toBeDefined();
      expect(receivedData.selectedCondition.selectedValue).toBeTruthy();
      expect(receivedData.selectedCondition.selectedValue).toEqual(component.choiceDataElement.choiceInfo[0].value);
    });

    it('Called updateFreeText (element, elementId, selectedCondition) with invalid values', () => {
      const element = { value: undefined };

      component.returnChoiceElement.subscribe(data => {
        receivedData = data;
      });

      component.updateFreeText(element, undefined, undefined);

      // Checks the received data
      expect(receivedData).toBeDefined();
      expect(receivedData).toBeTruthy();

      // Checks the received element of received data
      expect(receivedData.receivedElement).toBeDefined();
      expect(receivedData.receivedElement).toBeTruthy();

      expect(receivedData.receivedElement instanceof ChoiceElement);
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
