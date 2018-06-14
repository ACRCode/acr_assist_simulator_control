import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistReportTextComponent } from './assist-report-text.component';
import { MainReportText, AllReportText } from '../assist-data-element/assist-data-element.component';

describe('AssistReportTextComponent', () => {
  let component: AssistReportTextComponent;
  let fixture: ComponentFixture<AssistReportTextComponent>;
  let nativeElement: any;
  let mainReportText: MainReportText;
  let allReportText: AllReportText;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistReportTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    // create component and test fixture
    fixture = TestBed.createComponent(AssistReportTextComponent);

     // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement;

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement = undefined;
    mainReportText = undefined;
    allReportText = undefined;
  });

  function initialiseReportText() {
    mainReportText = new MainReportText();
    mainReportText.reportTextMainContent = '';
    mainReportText.allReportText = [];

    allReportText = new AllReportText();
    allReportText.reportText = '[LR-Treated] An observation that has undergone loco-regional treatment.';
    allReportText.sectionId = 'findings';
    mainReportText.allReportText.push(allReportText);

    component.reportText = mainReportText;
  }

  it('Created the AssistReportTextComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Called onSelect(sectionId) method with invalid sectionid to show the relevant report text', () => {
    initialiseReportText();

    component.onSelect(undefined);

    expect(component.selectedSectionId).toBeDefined();
    expect(component.selectedSectionId).toEqual('All');
    expect(component.sections).toBeDefined();
    expect(component.sections).toBeTruthy();
    expect(component.allTextReport).toBeDefined();
    expect(component.allTextReport).toBeTruthy();
    expect(component.selectedSection).toBeDefined();
    expect(component.selectedSection).toBeNull();
    expect(component.allReportTexts).toBeDefined();
    expect(component.allReportTexts).toBeTruthy();
    expect(component.mainReportTexts).toBeDefined();
    expect(component.mainReportTexts).toBeTruthy();
    expect(component.mainReportTexts.allReportText).toBeDefined();
    expect(component.mainReportTexts.allReportText).toBeTruthy();
    expect(component.mainReportTexts.reportTextMainContent).toBeDefined();
    expect(component.mainReportTexts.allReportText).toBeTruthy();
  });

  it('Called ngOnChanges(sectionId) method with invalid sectionid to show the relevant report text', () => {
    initialiseReportText();

    component.selectedSectionId = undefined;
    component.ngOnChanges(undefined);

    expect(component.selectedSectionId).toBeDefined();
    expect(component.selectedSectionId).toEqual('All');
    expect(component.sections).toBeDefined();
    expect(component.sections).toBeTruthy();
    expect(component.allTextReport).toBeDefined();
    expect(component.allTextReport).toBeTruthy();
    expect(component.selectedSection).toBeDefined();
    expect(component.selectedSection).toBeNull();
    expect(component.allReportTexts).toBeDefined();
    expect(component.allReportTexts).toBeTruthy();
    expect(component.mainReportTexts).toBeDefined();
    expect(component.mainReportTexts).toBeTruthy();
    expect(component.mainReportTexts.allReportText).toBeDefined();
    expect(component.mainReportTexts.allReportText).toBeTruthy();
    expect(component.mainReportTexts.reportTextMainContent).toBeDefined();
    expect(component.mainReportTexts.allReportText).toBeTruthy();
  });

  it('Called onSelect(sectionId) method with valid sectionid to show the relevant report text', () => {
    initialiseReportText();

    component.onSelect('findings');

    expect(component.selectedSectionId).toBeDefined();
    expect(component.selectedSectionId).toEqual('findings');
    expect(component.sections).toBeDefined();
    expect(component.sections).toBeTruthy();
    expect(component.allTextReport).toBeUndefined();
    expect(component.selectedSection).toBeDefined();
    expect(component.selectedSection).toBeTruthy();
    expect(component.allReportTexts).toBeDefined();
    expect(component.allReportTexts).toBeTruthy();
    expect(component.mainReportTexts).toBeDefined();
    expect(component.mainReportTexts).toBeTruthy();
    expect(component.mainReportTexts.allReportText).toBeDefined();
    expect(component.mainReportTexts.allReportText).toBeTruthy();
    expect(component.mainReportTexts.reportTextMainContent).toBeDefined();
    expect(component.mainReportTexts.allReportText).toBeTruthy();
  });

  it('Called ngOnChanges() method with valid sectionid to show the relevant report text', () => {
    initialiseReportText();
    component.selectedSectionId = 'findings';

    component.ngOnChanges(undefined);

    expect(component.selectedSectionId).toBeDefined();
    expect(component.selectedSectionId).toEqual('findings');
    expect(component.sections).toBeDefined();
    expect(component.sections).toBeTruthy();
    expect(component.allTextReport).toBeUndefined();
    expect(component.selectedSection).toBeDefined();
    expect(component.selectedSection).toBeTruthy();
    expect(component.allReportTexts).toBeDefined();
    expect(component.allReportTexts).toBeTruthy();
    expect(component.mainReportTexts).toBeDefined();
    expect(component.mainReportTexts).toBeTruthy();
    expect(component.mainReportTexts.allReportText).toBeDefined();
    expect(component.mainReportTexts.allReportText).toBeTruthy();
    expect(component.mainReportTexts.reportTextMainContent).toBeDefined();
    expect(component.mainReportTexts.allReportText).toBeTruthy();
  });

  it('Called removeEmptyLine() method with empty', () => {
    const value = component.removeEmptyLine('');
    expect(value).toBeUndefined();
  });

  it('Called removeEmptyLine() method with valid data', () => {
    const value = component.removeEmptyLine('This is a sample data.\nIt is to remove the empty space.');
    const splittedValue = value.split('\n');
    expect(value).toBeDefined();
    expect(value).toBeTruthy();
    expect(splittedValue).toBeDefined();
    expect(splittedValue[0]).toEqual('This is a sample data.');
    expect(splittedValue[1]).toEqual('It is to remove the empty space.');
  });

});
