import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistReportTextComponent } from './assist-report-text.component';
import { MainReportText, AllReportText } from '../assist-data-element/assist-data-element.component';

describe('AssistReportTextComponent', () => {
  let nativeElement: any;
  let component: AssistReportTextComponent;
  let fixture: ComponentFixture<AssistReportTextComponent>;

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

    component.reportText = new MainReportText();
    component.reportText.reportTextMainContent = '';
    component.reportText.allReportText = [];

    fixture.detectChanges();
  });

  afterEach(() => {
    component.reportText = null;
  });

  it('Created the AssistReportTextComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Called onSelect() method with invalid sectionid to show the relevant report text', () => {
    const dummyReportText = new AllReportText();
    dummyReportText.reportText = '[LR-Treated] An observation that has undergone loco-regional treatment.';
    dummyReportText.sectionId = 'findings';
    component.reportText.allReportText.push(dummyReportText);

    component.onSelect(undefined);

    expect(component.selectedSectionId).toBeDefined();
    expect(component.selectedSectionId).toBe('All');
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

  it('Called ngOnChanges() method with invalid sectionid to show the relevant report text', () => {
    const dummyReportText = new AllReportText();
    dummyReportText.reportText = '[LR-Treated] An observation that has undergone loco-regional treatment.';
    dummyReportText.sectionId = 'findings';
    component.reportText.allReportText.push(dummyReportText);

    component.selectedSectionId = undefined;
    component.ngOnChanges(undefined);

    expect(component.selectedSectionId).toBeDefined();
    expect(component.selectedSectionId).toBe('All');
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

  it('Called onSelect() method with valid sectionid to show the relevant report text', () => {
    const dummyReportText = new AllReportText();
    dummyReportText.reportText = '[LR-Treated] An observation that has undergone loco-regional treatment.';
    dummyReportText.sectionId = 'findings';
    component.reportText.allReportText.push(dummyReportText);

    component.onSelect('findings');

    expect(component.selectedSectionId).toBeDefined();
    expect(component.selectedSectionId).toBe('findings');
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
    const dummyReportText = new AllReportText();
    dummyReportText.reportText = '[LR-Treated] An observation that has undergone loco-regional treatment.';
    dummyReportText.sectionId = 'findings';
    component.reportText.allReportText.push(dummyReportText);

    component.selectedSectionId = 'findings';
    component.ngOnChanges(undefined);

    expect(component.selectedSectionId).toBeDefined();
    expect(component.selectedSectionId).toBe('findings');
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
    expect(splittedValue[0]).toBe('This is a sample data.');
    expect(splittedValue[1]).toBe('It is to remove the empty space.');
  });

});
