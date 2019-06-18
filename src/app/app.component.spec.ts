import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReportTextPosition } from './modules/core/models/report-text.model';
import { InputData } from './modules/core/models/input-data.model';
import { componentFactoryName } from '@angular/compiler';
import { BrowserModule } from '@angular/platform-browser';
import { AcrAssistSimulatorModule } from './modules/acr-assist-simulator/acr-assist-simulator.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SimulatorLoaderModule } from './modules/simulatorloader/simulatorloader.module';
import { FileDetails } from './modules/simulatorloader/shared/models/file-details.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        AcrAssistSimulatorModule,
        CommonModule,
        FormsModule,
        HttpModule,
        SimulatorLoaderModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(AppComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement = undefined;
  });

  it('Called loadElements() to set test input values', () => {

    expect(component.inputValues).toBeDefined();
    expect(component.inputValues.length).toEqual(0);

    component.loadElements();

    expect(component.inputValues).toBeDefined();
    expect(component.inputValues).toBeTruthy();
    expect(component.inputValues.length).toBeGreaterThan(0);

    component.inputValues.forEach(element => {
      expect(element.dataElementId).toBeDefined();
      expect(element.dataElementId).toBeTruthy();
      expect(element.dataElementValue).toBeDefined();
      expect(element.dataElementValue).toBeTruthy();
    });

    expect(component.inputValues instanceof InputData);
    expect(component.inputValues).toEqual(component.testInputValue);
  });

  it('Called returnDefaultElements() to clear the test input values ', () => {

    expect(component.inputValues).toBeDefined();
    expect(component.inputValues.length).toEqual(0);

    component.loadElements();

    expect(component.inputValues).toBeDefined();
    expect(component.inputValues).toBeTruthy();
    expect(component.inputValues.length).toBeGreaterThan(0);

    component.inputValues.forEach(element => {
      expect(element.dataElementId).toBeDefined();
      expect(element.dataElementId).toBeTruthy();
      expect(element.dataElementValue).toBeDefined();
      expect(element.dataElementValue).toBeTruthy();
    });

    expect(component.inputValues instanceof InputData);
    expect(component.inputValues).toEqual(component.testInputValue);

    component.returnDefaultElements();
    expect(component.inputValues).toBeDefined();
    expect(component.inputValues.length).toEqual(0);
  });

  it('Called fileSelected(fileDetails: FileDetails) to invalid data set file content', () => {
    const fileLabel = undefined;
    const fileName = undefined;
    const fileContents = undefined;
    const fileDetails = new FileDetails(fileLabel, fileName, fileContents);

    component.fileSelected(fileDetails);

    expect(component.fileContent).toBeUndefined();
    expect(component.imagePath).toBeDefined();
  });

  it('Called fileSelected(fileDetails: FileDetails) to valid data set file content', () => {
    const fileLabel = 'sample';
    const fileName = 'sample.xml';
    const fileContents = 'sample data';
    const fileDetails = new FileDetails(fileLabel, fileName, fileContents);

    component.fileSelected(fileDetails);

    expect(component.fileContent).toBeDefined();
    expect(component.fileContent).toBeTruthy();
    expect(component.fileContent).toEqual(fileDetails.fileContents);

    expect(component.imagePath).toBeDefined();
    expect(component.imagePath).toEqual('XMLFiles/Samples/' + fileDetails.fileLabel);
  });

});
