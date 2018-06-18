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
import { ConditionType } from '../../../core/models/conditiontype.model';
import { EqualCondition } from '../../../core/rules/equal-condition';
import { Branch } from '../../../core/models/branch.model';
import { EndPointRef } from '../../../core/models/endpointref.model';
import { DecisionPoint } from '../../../core/models/decisionpoint.model';
import { Rules } from '../../../core/rules/models/rules.model';
import { Diagram } from '../../../core/models/diagram.model';
import { Metadata } from '../../../core/metadata/models/metadata-model';
import { Template } from '../../../core/models/template.model';
import { BaseDataElement } from '../../../core/elements/models/base-data-element.model';

class MockSimulatorEngineService extends SimulatorEngineService {

}

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
      providers: [CarouselConfig, { provide: SimulatorEngineService, useClass: MockSimulatorEngineService }]
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

  function createMetaData() {
    const metaData = new Metadata();
    metaData.id = 'Lymph_Nodes';
    metaData.label = 'Lymph Nodes';
    metaData.ruleVersion = undefined;
    metaData.schemaVersion = '1.0';
    metaData.diagrams = [];

    const diagram = new Diagram();
    diagram.displaySequence = 1;
    diagram.keyDiagram = true;
    diagram.label = 'Key Diagram';
    diagram.location = 'keydiagram.png';
    metaData.diagrams.push(diagram);

    return metaData;
  }

  function createRules() {
    const rules = new Rules();
    rules.decisionPoints = [];
    const decisionPoint = new DecisionPoint();
    decisionPoint.id = 'macrodp';
    decisionPoint.label = 'Macro Banch';
    rules.decisionPoints.push(decisionPoint);
    rules.decisionPoints[0].branches = [];

    const branch = new Branch();
    branch.computedValue = undefined;
    branch.label = undefined;
    branch.endPointRef = new EndPointRef();
    branch.endPointRef.endPointId = 'macroEndpoint';

    const cond = new ConditionType();
    cond.comparisonValue = '10';
    cond.dataElementId = 'conditionConst';

    branch.condition = new EqualCondition(cond);
    rules.decisionPoints[0].branches.push(branch);

    return rules;
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

  it('Called ngAfterViewInit() method with current value intialized', () => {
    setDataElements(1);

    component.returnNumericElement.subscribe(data => {
      receivedData = data;
     });

    component.ngAfterViewInit();

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

  it('Called onlyNumberKey(event) with non numeric code returns false', () => {
    const event = { charCode: 25};
    const result = component.onlyNumberKey(event);
    expect(result).toBeDefined();
    expect(result).toBeFalsy();
  });

  it('Called onlyNumberKey(event) with backspace key returns null', () => {
    const event = { charCode: 8};
    const result = component.onlyNumberKey(event);
    expect(result).toBeNull();
  });

  it('Called onlyNumberKey(event) with arrow keys returns null', () => {
    const event = { charCode: 0};
    const result = component.onlyNumberKey(event);
    expect(result).toBeNull();
  });

  it('Called onlyNumberKey(event) with numeric code returns true', () => {
    const event = { charCode: 48};
    const result = component.onlyNumberKey(event);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });
});
