import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrAssistSimulatorComponent } from './acr-assist-simulator.component';
import { AssistDataElementComponent, AllReportText, MainReportText } from '../assist-data-element/assist-data-element.component';
import { AssistChoiceElementComponent } from '../assist-data-element/assist-choice-element/assist-choice-element.component';
import { AssistMultiChoiceElementComponent } from '../assist-data-element/assist-multi-choice-element/assist-multi-choice-element.component';
import { AssistNumericElementComponent } from '../assist-data-element/assist-numeric-element/assist-numeric-element.component';
import { HintDiagramComponent } from '../assist-data-element/hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../assist-data-element/image-map/image-map.component';
import { AssistReportTextComponent } from '../assist-report-text/assist-report-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { DiagramService } from '../shared/services/diagram.service';
import { ArrayCheckerService } from '../shared/services/array-checker.service';
import { ChoiceDataElementCreationService } from '../shared/services/choice-data-element-creation.service';
import { MultipleChoiceDataElementCreationService } from '../shared/services/multiple-choice-data-element-creation.service';
import { CreationServiceInjectorToken } from '../constants';
import { ComputedValueCreationService } from '../shared/services/computed-value-creation.service';
import { ConditionsCreationService } from '../shared/services/conditions-creation.service';
import { DecisionPointsCreationService } from '../shared/services/decision-points-creation.service';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { GlobalValueCreationService } from '../shared/services/global-value-creation.service';
import { IntegerDataElementCreationService } from '../shared/services/integer-data-element-creation.service';
import { NumericDataElementCreationService } from '../shared/services/numeric-data-element-creation.service';
import { ComputedDataElementCreationService } from '../shared/services/computed-data-element-creation.service';
import { ReportTextPosition } from '../../core/models/report-text.model';
import { ChoiceDataElement } from '../../core/elements/models/choice-data-element-model';
import { IntegerDataElement } from '../../core/elements/models/integer-data-element.model';
import { GlobalValue } from '../../core/elements/models/globalvalue.model';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AcrAssistSimulatorComponent', () => {
  let component: AcrAssistSimulatorComponent;
  let fixture: ComponentFixture<AcrAssistSimulatorComponent>;
  const position = ReportTextPosition;
  let decisionTreeElement: DebugElement;
  let rightReportTextPositionElement: DebugElement;
  let topReportTextPositionElement: DebugElement;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AcrAssistSimulatorComponent, AssistDataElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent,
                      AssistNumericElementComponent, HintDiagramComponent, ImageMapComponent, AssistReportTextComponent,
                      SlideComponent, CarouselComponent ],
      providers: [TemplateManagerService,
        DiagramService,
        CarouselConfig,
        ArrayCheckerService,
        ConditionsCreationService,
        DecisionPointsCreationService,
        ComputedValueCreationService,
        SimulatorEngineService,
       {provide: CreationServiceInjectorToken, useClass: ChoiceDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: MultipleChoiceDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: NumericDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: IntegerDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: GlobalValueCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: ComputedDataElementCreationService, multi: true }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(AcrAssistSimulatorComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement = null;
    decisionTreeElement = null;
    rightReportTextPositionElement = null;
    topReportTextPositionElement = null;
  });

  // Intialise the component with valid values
  function setValidValues(reportPosition, showDiagram) {

    component.templateContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-model href="../../../XML Schema/ACRAssist_xml_schema.rnc" type="application/relax-ng-compact-syntax"?>
    <ReportingModule>
      <Metadata>
        <Label>Epidural Spinal</Label>
        <ID>EpiduralSpinal</ID>
        <SchemaVersion>1.0</SchemaVersion>
        <ModuleVersion>1.0</ModuleVersion>
        <Info>
          <Description>This module describes the Common Data elements and Macros for IEpidural Spinal</Description>
          <References>
            <Citation Url="http://radelement.org/"> CDE URL </Citation>
          </References>
          <Diagrams>
            <Diagram DisplaySequence="1" IsKeyDiagram="true">
              <Location>keydiagram.jpg</Location>
              <Label>Epidural Spinal Key image</Label>
            </Diagram>
          </Diagrams>
          <Contact>
            <Name>ACR Assist</Name>
            <Email>acr-assist@acr.org</Email>
            <Institution>American College of Radiology</Institution>
          </Contact>
        </Info>
        <ReportCitationText>Epidural Spinal</ReportCitationText>
            <ApplicableSexes Value="Both"></ApplicableSexes>
      </Metadata>
      <DataElements>
        <GlobalValue Id="conditionConst">10</GlobalValue>
        <IntegerDataElement Id="SPINALINSTABILITYNEOPLASTICSCORE" IsRequired="false" DisplaySequence="1" CdeId = "100">
            <Label>SPINAL INSTABILITY NEOPLASTIC SCORE</Label>
            <Hint>Points assigned to feature</Hint>
            <Minimum>1</Minimum>
            <Maximum>20</Maximum>
          </IntegerDataElement>
        <ChoiceDataElement Id="LOCATION" DisplaySequence="2" IsRequired="true" CdeId = "100">
          <Label>LOCATION</Label>
          <ChoiceInfo>
            <Choice>
              <Value>rigidspine</Value>
              <Label>Rigid spine</Label>
            </Choice>
            <Choice>
              <Value>semi-rigidspine</Value>
              <Label>Semi-rigid spine</Label>
            </Choice>
            <Choice>
              <Value>mobilespine</Value>
              <Label>Mobile spine</Label>
            </Choice>
            <Choice>
              <Value>junctional</Value>
              <Label>Junctional</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        <ChoiceDataElement Id="LESIONQUALITY" DisplaySequence="3" IsRequired="true" CdeId = "100">
          <Label>LESION QUALITY</Label>
          <ChoiceInfo>
            <Choice>
              <Value>blastic</Value>
              <Label>Blastic</Label>
            </Choice>
            <Choice>
              <Value>mixed</Value>
              <Label>Mixed</Label>
            </Choice>
            <Choice>
              <Value>lytic</Value>
              <Label>Lytic</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        <ChoiceDataElement Id="ALIGNMENT" DisplaySequence="4" IsRequired="true" CdeId = "100">
          <Label>ALIGNMENT</Label>
          <ChoiceInfo>
            <Choice>
              <Value>preserved</Value>
              <Label>Preserved</Label>
            </Choice>
            <Choice>
              <Value>deformity</Value>
              <Label>Deformity</Label>
            </Choice>
            <Choice>
              <Value>subluxation</Value>
              <Label>Subluxation</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        <ChoiceDataElement Id="COLLAPSE" DisplaySequence="5" IsRequired="true" CdeId = "100">
          <Label>COLLAPSE</Label>
          <ChoiceInfo>
            <Choice>
              <Value>none</Value>
              <Label>None</Label>
            </Choice>
            <Choice>
              <Value>morethan50</Value>
                <Label>More than 50%</Label>
            </Choice>
            <Choice>
              <Value>more than 50% body involved</Value>
              <Label>More than 50% body involved</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        <ChoiceDataElement Id="POSTERIORELEMENTS" IsRequired="true" DisplaySequence="6" CdeId = "100">
          <Label>POSTERIOR ELEMENTS</Label>
          <ChoiceInfo>
            <Choice>
              <Value>none</Value>
              <Label>None</Label>
            </Choice>
            <Choice>
              <Value>unilteral</Value>
              <Label>Unilteral</Label>
            </Choice>
            <Choice>
              <Value>bilateral</Value>
              <Label>Bilateral</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        <ChoiceDataElement Id="injurylevel" IsRequired="true" AllowFreetext="true" DisplaySequence="7">
          <Label>Injury Level</Label>
          <ChoiceInfo>
            <Choice>
              <Value>Sensory</Value>
              <Label>Sensory level</Label>
            </Choice>
            <Choice>
              <Value>Neurologic</Value>
              <Label>Neurologic level</Label>
            </Choice>
            <Choice>
              <Value>Motor</Value>
              <Label>Motor level</Label>
            </Choice>
            <Choice>
              <Value>Skeletal</Value>
              <Label>Skeletal level</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        <ChoiceDataElement Id="CompressionGrade" IsRequired="true" DisplaySequence="8" CdeId = "100">
          <Label>Compression grade</Label>
          <ChoiceInfo>
            <Choice>
              <Value>1a</Value>
              <Label>1a</Label>
            </Choice>
            <Choice>
              <Value>1b</Value>
              <Label>1b</Label>
            </Choice>
            <Choice>
              <Value>2</Value>
              <Label>2</Label>
            </Choice>
            <Choice>
              <Value>3</Value>
              <Label>3</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
      </DataElements>
      <Rules>
        <DecisionPoint Id="macrodp">
          <Label>Macro Banch</Label>
          <Branch>
            <EqualCondition DataElementId="conditionConst" ComparisonValue="10"/>
            <EndPointRef EndPointId="macroEndpoint"></EndPointRef>
          </Branch>
        </DecisionPoint>
      </Rules>
      <EndPoints>
       <TemplatePartial Id ="ExamPartial">
      EXAM TYPE: MR THORACIC SPINE W/O CONTRAST
      EXAM DATE AND TIME: 5/9/2018 6:31 PM EDT
      INDICATION: leg weakness
      COMPARISON: NONE
       </TemplatePartial>
        <EndPoint Id="macroEndpoint">
        <Label>A</Label>
         <ReportTexts>
            <ReportText SectionId="findings">
              &amp;nbsp;
              CDE Report text
              &amp;nbsp;
              &amp;nbsp;
              <SectionIf DataElementId="SPINALINSTABILITYNEOPLASTICSCORE">&amp;nbsp;
              Spinal Level:&amp;nbsp;<InsertValue DataElementId="SPINALINSTABILITYNEOPLASTICSCORE"/>&amp;nbsp;
              </SectionIf>
              <SectionIf DataElementId="LOCATION">&amp;nbsp;
              LOCATION:&amp;nbsp;<InsertValue DataElementId="LOCATION"/>&amp;nbsp;
              </SectionIf>
              <SectionIf DataElementId="LESIONQUALITY">&amp;nbsp;
              LESION QUALITY:&amp;nbsp;<InsertValue DataElementId="LESIONQUALITY"/></SectionIf>&amp;nbsp;
              <SectionIf DataElementId="ALIGNMENT">&amp;nbsp;
              ALIGNMENT:&amp;nbsp;<InsertValue DataElementId="ALIGNMENT"/></SectionIf>  &amp;nbsp;
              <SectionIf DataElementId="COLLAPSE">&amp;nbsp;
              COLLAPSE:&amp;nbsp;<InsertValue DataElementId="COLLAPSE"/></SectionIf>  &amp;nbsp;
              <SectionIf DataElementId="POSTERIORELEMENTS">&amp;nbsp;
              POSTERIOR ELEMENTS:&amp;nbsp;<InsertValue DataElementId="POSTERIORELEMENTS"/></SectionIf>  &amp;nbsp;
              <SectionIf DataElementId="injurylevel">&amp;nbsp;
              Level of greatest compression:&amp;nbsp;<InsertValue DataElementId="injurylevel"/></SectionIf>  &amp;nbsp;
              <SectionIf DataElementId="CompressionGrade">&amp;nbsp;
              Compression grade:&amp;nbsp;<InsertValue DataElementId="CompressionGrade"/></SectionIf>  &amp;nbsp;
            </ReportText>
          </ReportTexts>
        </EndPoint>
      </EndPoints>
    </ReportingModule>`;
    component.reportTextPosition = reportPosition;
    component.showKeyDiagram = showDiagram;
    component.inputValues = [];
    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  // Intialise the component with invalid xml
  function setInValidValuesWithInvalidXml() {

    component.templateContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-model href="../../../XML Schema/ACRAssist_xml_schema.rnc" type="application/relax-ng-compact-syntax"?>
    <ReportingModule>`;
    component.reportTextPosition = position.Right;
    component.showKeyDiagram = true;
    component.inputValues = [];
    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  // Intialise the component with empty xml
  function setInValidValuesWithEmptyXml() {
    component.templateContent = '';
    component.reportTextPosition = position.Right;
    component.showKeyDiagram = true;
    component.inputValues = [];
    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  it('Created the AcrAssistSimulatorComponent', () => {
    expect(component).toBeTruthy();
  });

  it('AcrAssistSimulatorComponent with valid template content', () => {
    setValidValues(position.Right, true);
    component.ngOnChanges(undefined);

    // Checks if is empty content
    expect(component.isEmptyContent).toBeDefined();
    expect(component.isEmptyContent).toBeFalsy();
    expect(component.inputData).toBeUndefined();

    // Checks the template values
    expect(component.template).toBeDefined();
    expect(component.template).toBeTruthy();

    // Checks the data elements inside template
    expect(component.template.dataElements).toBeDefined();
    expect(component.template.dataElements).toBeTruthy();

    component.template.dataElements.forEach(element => {

      if (element instanceof ChoiceDataElement) { // Checks if dataelement is of choice element type
        const choiceDataElement  = <ChoiceDataElement> element;
        expect(choiceDataElement.id).toBeDefined();
        expect(choiceDataElement.id).toBeTruthy();
        expect(choiceDataElement.dataElementType).toBeDefined();
        expect(choiceDataElement.dataElementType).toBeTruthy();
        expect(choiceDataElement.dataElementType).toBe('ChoiceDataElement');
        expect(choiceDataElement.choiceInfo).toBeDefined();
        expect(choiceDataElement.choiceInfo).toBeTruthy();

        choiceDataElement.choiceInfo.forEach(choice => {
          expect(choice.label).toBeDefined();
          expect(choice.label).toBeTruthy();
          expect(choice.value).toBeDefined();
          expect(choice.value).toBeTruthy();
          expect(choice.reportText).toBeUndefined();
          expect(choice.default).toBeDefined();
          expect(choice.default).toBeFalsy();
        });

      } else if (element instanceof IntegerDataElement) { // Checks if dataelement is of integer element type
        const integerDataElement  = <IntegerDataElement> element;
        expect(integerDataElement.id).toBeDefined();
        expect(integerDataElement.id).toBeTruthy();
        expect(integerDataElement.dataElementType).toBeDefined();
        expect(integerDataElement.dataElementType).toBeTruthy();
        expect(integerDataElement.dataElementType).toBe('IntegerDataElement');
        expect(integerDataElement.label).toBeDefined();
        expect(integerDataElement.label).toBeTruthy();

      } else if (element instanceof GlobalValue) { // Checks if dataelement is of global value type
        const integerDataElement  = <GlobalValue> element;
        expect(integerDataElement.id).toBeDefined();
        expect(integerDataElement.id).toBeTruthy();
        expect(integerDataElement.dataElementType).toBeDefined();
        expect(integerDataElement.dataElementType).toBeTruthy();
        expect(integerDataElement.dataElementType).toBe('GlobalValue');
        expect(integerDataElement.currentValue).toBeDefined();
        expect(integerDataElement.currentValue).toBeTruthy();
        expect(integerDataElement.isVisible).toBeDefined();
      }
    });

    // Checks the end point strings inside template
    expect(component.template.endPointsString).toBeDefined();
    expect(component.template.endPointsString).toBeTruthy();

    // Checks the metadata inside template
    expect(component.template.metadata).toBeDefined();
    expect(component.template.metadata).toBeTruthy();
    expect(component.template.metadata.id).toBeDefined();
    expect(component.template.metadata.id).toBeTruthy();
    expect(component.template.metadata.label).toBeDefined();
    expect(component.template.metadata.label).toBeTruthy();
    expect(component.template.metadata.schemaVersion).toBeDefined();
    expect(component.template.metadata.schemaVersion).toBeTruthy();

    // Checks the diagrams inside metadata
    expect(component.template.metadata.diagrams).toBeDefined();
    expect(component.template.metadata.diagrams).toBeTruthy();

    component.template.metadata.diagrams.forEach(element => {
      expect(element.label).toBeDefined();
      expect(element.label).toBeTruthy();
      expect(element.location).toBeDefined();
      expect(element.location).toBeTruthy();
      expect(element.displaySequence).toBeDefined();
      expect(element.displaySequence).toBeTruthy();
      expect(element.keyDiagram).toBeDefined();
      expect(element.keyDiagram).toBeTruthy();
    });

    // Checks the rules inside template
    expect(component.template.rules).toBeDefined();
    expect(component.template.rules).toBeTruthy();

    // Checks the decision points inside rules
    expect(component.template.rules.decisionPoints).toBeDefined();
    expect(component.template.rules.decisionPoints).toBeTruthy();

    component.template.rules.decisionPoints.forEach(element => {
      expect(element.label).toBeDefined();
      expect(element.label).toBeTruthy();
      expect(element.id).toBeDefined();
      expect(element.id).toBeTruthy();
      expect(element.branches).toBeDefined();
      expect(element.branches).toBeTruthy();

      // Checks the branches inside decision point
      element.branches.forEach(branch => {
        expect(branch.endPointRef).toBeDefined();
        expect(branch.endPointRef).toBeTruthy();
        expect(branch.endPointRef.endPointId).toBeDefined();
        expect(branch.endPointRef.endPointId).toBeTruthy();
        expect(branch.condition).toBeDefined();
        expect(branch.condition).toBeTruthy();
        expect(branch.condition.conditionType).toBeDefined();
        expect(branch.condition.conditionType).toBeTruthy();
        expect(branch.condition.conditionType.comparisonValue).toBeDefined();
        expect(branch.condition.conditionType.comparisonValue).toBeTruthy();
        expect(branch.condition.conditionType.dataElementId).toBeDefined();
        expect(branch.condition.conditionType.dataElementId).toBeTruthy();
      });
    });

    // Checks the template partial inside template
    expect(component.template.templatePartial).toBeDefined();
    expect(component.template.templatePartial).toBeTruthy();

     // Checks the xml content inside template
     expect(component.template.xmlContent).toBeDefined();
     expect(component.template.xmlContent).toBeTruthy();

     expect(component.resultText).toBeUndefined();
  });

  it('AcrAssistSimulatorComponent with empty template content', () => {
    setInValidValuesWithEmptyXml();
    component.ngOnChanges(undefined);

    // Checks if is empty content
    expect(component.isEmptyContent).toBeDefined();
    expect(component.isEmptyContent).toBeTruthy();
    expect(component.inputData).toBeUndefined();

    // Checks the template , dataelements, keydiagrams, result tesxt values
    expect(component.template).toBeUndefined();
    expect(component.dataElements).toBeUndefined();
    expect(component.keyDiagrams).toBeUndefined();
    expect(component.resultText).toBeUndefined();
  });

  it('AcrAssistSimulatorComponent with invalid template content', () => {
    setInValidValuesWithInvalidXml();
    component.ngOnChanges(undefined);

    // Checks if is empty content
    expect(component.isEmptyContent).toBeDefined();
    expect(component.isEmptyContent).toBeFalsy();
    expect(component.inputData).toBeUndefined();

    // Checks the template
    expect(component.template).toBeUndefined();
  });

  it('AcrAssistSimulatorComponent with ShowKeydiagram as true', () => {
    setValidValues(position.Right, true);
    component.ngOnChanges(undefined);
    fixture.detectChanges();

    decisionTreeElement = fixture.debugElement.query(By.css('#diagramUpload'));

    expect(component.imageUpload).toBeDefined();
    expect(component.imageUpload).toBeTruthy();
  });

  it('AcrAssistSimulatorComponent with ShowKeydiagram as false', () => {
    setValidValues(position.Right, false);
    component.showKeyDiagram = false;
    component.ngOnChanges(undefined);
    fixture.detectChanges();

    decisionTreeElement = fixture.debugElement.query(By.css('#diagramUpload'));

    expect(component.imageUpload).toBeUndefined();
  });
});
