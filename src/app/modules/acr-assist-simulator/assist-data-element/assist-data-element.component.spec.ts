import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { AssistDataElementComponent, ChoiceElement, MultiChoiceElement, NumericElement, FinalExecutedHistory, ExecutedResultHistory, MainReportText, AllReportText } from './assist-data-element.component';
import { AssistChoiceElementComponent } from './assist-choice-element/assist-choice-element.component';
import { AssistMultiChoiceElementComponent } from './assist-multi-choice-element/assist-multi-choice-element.component';
import { AssistNumericElementComponent } from './assist-numeric-element/assist-numeric-element.component';
import { AssistReportTextComponent } from '../assist-report-text/assist-report-text.component';
import { HintDiagramComponent } from './hint-diagram/hint-diagram.component';
import { ImageMapComponent } from './image-map/image-map.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NumericDataElement } from '../../core/elements/models/numeric-data-element.model';
import { ChoiceDataElement } from '../../core/elements/models/choice-data-element-model';
import { Choice } from '../../core/elements/models/choice.model';
import { GlobalValue } from '../../core/elements/models/globalvalue.model';
import { Template } from '../../core/models/template.model';
import { Metadata } from '../../core/metadata/models/metadata-model';
import { Diagram } from '../../core/models/diagram.model';
import { DecisionPoint } from '../../core/models/decisionpoint.model';
import { Branch } from '../../core/models/branch.model';
import { EndPointRef } from '../../core/models/endpointref.model';
import { ConditionType } from '../../core/models/conditiontype.model';
import { EqualCondition } from '../../core/rules/equal-condition';
import { IntegerDataElement } from '../../core/elements/models/integer-data-element.model';
import { SelectedCondition } from '../../core/models/executed-result.model';
import { DateTimeDataElementCreationService } from '../shared/services/dateTime-data-element-creation.service';

class MockSimulatorEngineService extends SimulatorEngineService {
}

describe('AssistDataElementComponent', () => {
  let component: AssistDataElementComponent;
  let fixture: ComponentFixture<AssistDataElementComponent>;
  let nativeElement: any;
  let numericDataElement: NumericDataElement;
  let multiChoiceDataElement: ChoiceDataElement;
  let choiceDataElement: ChoiceDataElement;
  let globalDataElement: GlobalValue;
  let template: Template;
  let choice: Choice;
  let reportData: any;
  let executionHistory: any;
  let mockSimulatorEngineService: SimulatorEngineService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistDataElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent,
                      AssistNumericElementComponent, AssistReportTextComponent, HintDiagramComponent, ImageMapComponent,
                      SlideComponent, CarouselComponent ],
      providers: [TemplateManagerService,
        DiagramService,
        CarouselConfig,
        ArrayCheckerService,
        ConditionsCreationService,
        DecisionPointsCreationService,
        ComputedValueCreationService,
        { provide: SimulatorEngineService, useClass: MockSimulatorEngineService },
       {provide: CreationServiceInjectorToken, useClass: ChoiceDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: MultipleChoiceDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: NumericDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: IntegerDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: GlobalValueCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: ComputedDataElementCreationService, multi: true },
       {provide: CreationServiceInjectorToken, useClass: DateTimeDataElementCreationService, multi: true }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // create component and test fixture
    fixture = TestBed.createComponent(AssistDataElementComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // get native element of test component from the fixture
    nativeElement = fixture.debugElement.nativeElement;

    component.dataElements = [];

    mockSimulatorEngineService = TestBed.get(SimulatorEngineService);

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement = undefined;
    numericDataElement = undefined;
    multiChoiceDataElement = undefined;
    choiceDataElement = undefined;
    globalDataElement = undefined;
    template = undefined;
    choice = undefined;
    reportData = undefined;
    executionHistory = undefined;
    mockSimulatorEngineService = undefined;
  });

  function setTemplateData() {
    component.xmlContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-model href="../../../XML Schema/ACRAssist_xml_schema.rnc" type="application/relax-ng-compact-syntax"?>
    <ReportingModule>
      <Metadata>
        <Label>Lymph Nodes</Label>
        <ID>Lymph_Nodes</ID>
        <SchemaVersion>1.0</SchemaVersion>
        <ModuleVersion>1.0</ModuleVersion>
        <Info>
          <Description>This module describes the Common Data elements and Macros for Lymph Nodes</Description>

          <References>
            <Citation Url="http://radelement.org/"> CDE URL </Citation>
            <Citation Url="https://docs.google.com/spreadsheets/d/1mXqXAByeur3C5ud-wbLY2vggB29-nSxU5nYpoInGsK4/edit#gid=891834841"> CDE google sheet </Citation>
          </References>

          <Diagrams>
            <Diagram DisplaySequence="1" IsKeyDiagram="true">
              <Location>keydiagram.jpg</Location>
              <Label>Key Diagram</Label>
            </Diagram>
            <Diagram DisplaySequence="2" >
              <Location>lymphnodessupportingdiagram.jpg</Location>
              <Label>lymph nodes supporting diagram</Label>
            </Diagram>
          </Diagrams>
          <Contact>
            <Name>ACR Assist</Name>
            <Email>acr-assist@acr.org</Email>
            <Institution>American College of Radiology</Institution>
          </Contact>
        </Info>
        <ReportCitationText>Lymph Nodes</ReportCitationText>
            <ApplicableSexes Value="Both"></ApplicableSexes>

      </Metadata>
      <DataElements>

        <GlobalValue Id="conditionConst">10</GlobalValue>
        <ChoiceDataElement Id="singlemultiple" DisplaySequence="1" IsRequired="true" CdeId = "100">
          <Label>Number of nodes</Label>
          <ChoiceInfo>
            <Choice>
              <Value>Single</Value>
              <Label>Single</Label>
            </Choice>
            <Choice>
              <Value>Multiple</Value>
              <Label>Multiple</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <ChoiceDataElement Id="laterality" DisplaySequence="2" IsRequired="true" CdeId = "100">
          <Label>Laterality</Label>
          <ChoiceInfo>
            <Choice>
              <Value>left</Value>
              <Label>Unilateral-left</Label>
            </Choice>
            <Choice>
              <Value>right</Value>
              <Label>Unilateral-right</Label>
            </Choice>
            <Choice>
              <Value>bilateral</Value>
              <Label>Bilateral</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <IntegerDataElement Id="sizeoflargestcluster" IsRequired="true" DisplaySequence="3" CdeId = "100">
          <Label>Size of largest cluster(in mm)</Label>
          <Hint>Use longest dimension (improved clinical-radiologic correlation and adherence to staging systems)</Hint>
          <Minimum>1</Minimum>
        </IntegerDataElement>

        <MultiChoiceDataElement Id="levelsinvolved" IsRequired="true" DisplaySequence="4" CdeId = "100">
          <Label>Which levels involved?</Label>
          <ChoiceInfo>
            <Choice>
              <Value>I</Value>
              <Label>I</Label>

            </Choice>
            <Choice>
              <Value>II</Value>
              <Label>II</Label>
            </Choice>
            <Choice>
              <Value>III</Value>
              <Label>III</Label>
            </Choice>
            <Choice>
              <Value>IV</Value>
              <Label>IV</Label>
            </Choice>
            <Choice>
              <Value>V</Value>
              <Label>V</Label>
            </Choice>
            <Choice>
              <Value>VIa</Value>
              <Label>VIa</Label>
            </Choice>
            <Choice>
              <Value>VIb</Value>
              <Label>VIb</Label>
            </Choice>
          </ChoiceInfo>
        </MultiChoiceDataElement>

        <ChoiceDataElement Id="degreeofcertainty"  DisplaySequence="6" CdeId = "100">
          <Label>ECS (degree of certainty)</Label>
          <Hint>Read with high specificity -- only call "definite" if uneqivocal</Hint>
          <ChoiceInfo>
            <Choice>
              <Value>definite</Value>
              <Label>Definite</Label>
            </Choice>
            <Choice>
              <Value>possible</Value>
              <Label>Possible</Label>
            </Choice>
            <Choice>
              <Value>absent</Value>
              <Label>Absent</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <ChoiceDataElement Id="enhancement_pattern"  DisplaySequence="7" IsRequired="false" CdeId = "100">
          <Label>Pattern of enhancement</Label>
          <Hint>threshold: 20% or more cystic by volume</Hint>
          <ChoiceInfo>
            <Choice>
              <Value>cystic</Value>
              <Label>Cystic</Label>
            </Choice>
            <Choice>
              <Value>solid</Value>
              <Label>Solid</Label>
            </Choice>
            <Choice>
              <Value>necrotic</Value>
              <Label>Necrotic</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>


        <ChoiceDataElement Id="degreeofcertaintyforinvolvement" DisplaySequence="8" IsRequired="true" CdeId = "100">
          <Label>Degree of certainty for involvement (NIRADS)</Label>
          <Hint>1 = negative; 2 = low likelihood; 3 = high likelihood; 4 = definite disease </Hint>
          <ChoiceInfo>
            <Choice>
              <Value>1</Value>
              <Label>1</Label>
            </Choice>
            <Choice>
              <Value>2</Value>
              <Label>2</Label>
            </Choice>
            <Choice>
              <Value>3</Value>
              <Label>3</Label>
            </Choice>
            <Choice>
              <Value>4</Value>
              <Label>4</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <ChoiceDataElement Id="drainagepattern" DisplaySequence="9" IsRequired="false" CdeId = "100">
          <Label>Are these nodes in expected drainage pattern?</Label>
          <ChoiceInfo>
            <Choice>
              <Value>yes</Value>
              <Label>Yes</Label>
            </Choice>
            <Choice>
              <Value>no</Value>
              <Label>No</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <ChoiceDataElement Id="invasion_of_critical_structures" DisplaySequence="10" IsRequired="true" CdeId = "100">
          <Label>Invasion of critical structures (carotid, prevertebral)</Label>
          <Hint>rule of thumb: percentage of circumferential arterial contact = likelihood of invasion</Hint>
          <ChoiceInfo>
            <Choice>
              <Value>probable</Value>
              <Label>Probable</Label>
            </Choice>
            <Choice>
              <Value>possible</Value>
              <Label>Possible</Label>
            </Choice>
            <Choice>
              <Value>negative</Value>
              <Label>Negative (or percentage chance)</Label>
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
          EXAMINATION:  CT NECK WITH CONTRAST
          EXAM DATE AND TIME: 5/9/2018 1:30 PM EDT
          INDICATION: neck swelling
          COMPARISON: None available.
          </TemplatePartial>
        <EndPoint Id="macroEndpoint">
        <Label>A</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
                <!--<InsertPartial PartialId="ExamPartial">  </InsertPartial> -->

              &amp;nbsp;
              CDE Report text
              &amp;nbsp;
              &amp;nbsp;

              <SectionIf DataElementId="singlemultiple">
              <SectionIfValue DataElementId="singlemultiple" ComparisonValue="Single">A single pathologic lymph node is&amp;nbsp;</SectionIfValue>
              <SectionIfValue DataElementId="singlemultiple" ComparisonValue="Multiple">Multiple pathologic lymph nodes are&amp;nbsp;</SectionIfValue>
              <SectionIf DataElementId="laterality">present in the
              <SectionIfValue DataElementId="laterality" ComparisonValue="right">&amp;nbsp;right</SectionIfValue>
              <SectionIfValue DataElementId="laterality" ComparisonValue="left">&amp;nbsp;left</SectionIfValue>
              <SectionIfValue DataElementId="laterality" ComparisonValue="bilateral">&amp;nbsp;bilateral</SectionIfValue>
              <SectionIf DataElementId="singlemultiple">&amp;nbsp;neck.</SectionIf>
              </SectionIf></SectionIf>

              <SectionIf DataElementId="sizeoflargestcluster">&amp;nbsp;
              The largest
              <SectionIfValue DataElementId="singlemultiple" ComparisonValue="Single"><SectionIf DataElementId="sizeoflargestcluster">&amp;nbsp;node&amp;nbsp;</SectionIf></SectionIfValue>
              <SectionIfValue DataElementId="singlemultiple" ComparisonValue="Multiple">&amp;nbsp;nodal cluster&amp;nbsp;</SectionIfValue>
              <SectionIf DataElementId="sizeoflargestcluster">measures&amp;nbsp;<InsertValue DataElementId="sizeoflargestcluster">&amp;nbsp;mm.</InsertValue></SectionIf>

              </SectionIf>
              <SectionIf DataElementId="levelsinvolved">&amp;nbsp;
              Involved surgical levels include:&amp;nbsp;<InsertValue DataElementId="levelsinvolved">&amp;nbsp;nodes.</InsertValue>
              </SectionIf>

              <SectionIf DataElementId="degreeofcertainty">&amp;nbsp;
              There is&amp;nbsp;
              <SectionIfValue DataElementId="degreeofcertainty" ComparisonValue="possible">no&amp;nbsp;</SectionIfValue>
              <SectionIfValue DataElementId="degreeofcertainty" ComparisonValue="absent">no&amp;nbsp;</SectionIfValue>
              <SectionIf DataElementId="degreeofcertainty">definite radiologic evidence of extracapsular spread.</SectionIf>
              </SectionIf>

              <SectionIf DataElementId="enhancement_pattern">&amp;nbsp;
              There is&amp;nbsp;
              <SectionIfValueNot DataElementId="enhancement_pattern" ComparisonValue="necrotic">no&amp;nbsp;</SectionIfValueNot>
              evidence of central necrosis.

              <SectionIfValueNot DataElementId="enhancement_pattern" ComparisonValue="necrotic">&amp;nbsp;
              The enhancement pattern is&amp;nbsp;
                <SectionIfValue DataElementId="enhancement_pattern" ComparisonValue="cystic">predominantly cystic.</SectionIfValue>
                <SectionIfValue DataElementId="enhancement_pattern" ComparisonValue="solid">predominantly solid.</SectionIfValue>
              </SectionIfValueNot>&amp;nbsp;
              </SectionIf>
              <SectionIf DataElementId="drainagepattern">&amp;nbsp;
              These nodes are&amp;nbsp;
              <SectionIfValue DataElementId="drainagepattern" ComparisonValue="no">not&amp;nbsp;</SectionIfValue> <SectionIf DataElementId="drainagepattern">in the expected drainage pattern of the primary tumor.</SectionIf>
              </SectionIf>
              <SectionIf DataElementId="invasion_of_critical_structures">&amp;nbsp;
              There is&amp;nbsp;
              <SectionIfValue DataElementId="invasion_of_critical_structures" ComparisonValue="negative">no evidence of invasion of critical structures.&amp;nbsp;</SectionIfValue>
              <SectionIfValue DataElementId="invasion_of_critical_structures" ComparisonValue="possible">possible invasion of the carotid artery.&amp;nbsp;</SectionIfValue>
              <SectionIfValue DataElementId="invasion_of_critical_structures" ComparisonValue="probable">probable invasion of the prevertebral space.&amp;nbsp;</SectionIfValue>&amp;nbsp;
              </SectionIf>
              <SectionIf DataElementId="degreeofcertaintyforinvolvement">&amp;nbsp;
              NIRADS category&amp;nbsp;
              <InsertValue DataElementId="degreeofcertaintyforinvolvement"></InsertValue>
              </SectionIf>
            </ReportText>
          </ReportTexts>
        </EndPoint>
      </EndPoints>
    </ReportingModule>`;

    component.templatePartial = [ `
    <TemplatePartial Id ="ExamPartial">
      EXAMINATION:  CT NECK WITH CONTRAST
      EXAM DATE AND TIME: 5/9/2018 1:30 PM EDT
      INDICATION: neck swelling
      COMPARISON: None available.
    </TemplatePartial>`];

     component.endPointXMLString = [`
     <EndPoint Id="macroEndpoint">
       <Label>A</Label>
         <ReportTexts>
           <ReportText SectionId="findings">
               <!--<InsertPartial PartialId="ExamPartial">  </InsertPartial> -->

             &amp;nbsp;
             CDE Report text
             &amp;nbsp;
             &amp;nbsp;

             <SectionIf DataElementId="singlemultiple">
             <SectionIfValue DataElementId="singlemultiple" ComparisonValue="Single">A single pathologic lymph node is&amp;nbsp;</SectionIfValue>
             <SectionIfValue DataElementId="singlemultiple" ComparisonValue="Multiple">Multiple pathologic lymph nodes are&amp;nbsp;</SectionIfValue>
             <SectionIf DataElementId="laterality">present in the
             <SectionIfValue DataElementId="laterality" ComparisonValue="right">&amp;nbsp;right</SectionIfValue>
             <SectionIfValue DataElementId="laterality" ComparisonValue="left">&amp;nbsp;left</SectionIfValue>
             <SectionIfValue DataElementId="laterality" ComparisonValue="bilateral">&amp;nbsp;bilateral</SectionIfValue>
             <SectionIf DataElementId="singlemultiple">&amp;nbsp;neck.</SectionIf>
             </SectionIf></SectionIf>

             <SectionIf DataElementId="sizeoflargestcluster">&amp;nbsp;
             The largest
             <SectionIfValue DataElementId="singlemultiple" ComparisonValue="Single"><SectionIf DataElementId="sizeoflargestcluster">&amp;nbsp;node&amp;nbsp;</SectionIf></SectionIfValue>
             <SectionIfValue DataElementId="singlemultiple" ComparisonValue="Multiple">&amp;nbsp;nodal cluster&amp;nbsp;</SectionIfValue>
             <SectionIf DataElementId="sizeoflargestcluster">measures&amp;nbsp;<InsertValue DataElementId="sizeoflargestcluster">&amp;nbsp;mm.</InsertValue></SectionIf>

             </SectionIf>
             <SectionIf DataElementId="levelsinvolved">&amp;nbsp;
             Involved surgical levels include:&amp;nbsp;<InsertValue DataElementId="levelsinvolved">&amp;nbsp;nodes.</InsertValue>
             </SectionIf>

             <SectionIf DataElementId="degreeofcertainty">&amp;nbsp;
             There is&amp;nbsp;
             <SectionIfValue DataElementId="degreeofcertainty" ComparisonValue="possible">no&amp;nbsp;</SectionIfValue>
             <SectionIfValue DataElementId="degreeofcertainty" ComparisonValue="absent">no&amp;nbsp;</SectionIfValue>
             <SectionIf DataElementId="degreeofcertainty">definite radiologic evidence of extracapsular spread.</SectionIf>
             </SectionIf>

             <SectionIf DataElementId="enhancement_pattern">&amp;nbsp;
             There is&amp;nbsp;
             <SectionIfValueNot DataElementId="enhancement_pattern" ComparisonValue="necrotic">no&amp;nbsp;</SectionIfValueNot>
             evidence of central necrosis.

             <SectionIfValueNot DataElementId="enhancement_pattern" ComparisonValue="necrotic">&amp;nbsp;
             The enhancement pattern is&amp;nbsp;
               <SectionIfValue DataElementId="enhancement_pattern" ComparisonValue="cystic">predominantly cystic.</SectionIfValue>
               <SectionIfValue DataElementId="enhancement_pattern" ComparisonValue="solid">predominantly solid.</SectionIfValue>
             </SectionIfValueNot>&amp;nbsp;
             </SectionIf>
             <SectionIf DataElementId="drainagepattern">&amp;nbsp;
             These nodes are&amp;nbsp;
             <SectionIfValue DataElementId="drainagepattern" ComparisonValue="no">not&amp;nbsp;</SectionIfValue> <SectionIf DataElementId="drainagepattern">in the expected drainage pattern of the primary tumor.</SectionIf>
             </SectionIf>

             <SectionIf DataElementId="invasion_of_critical_structures">&amp;nbsp;
             There is&amp;nbsp;
             <SectionIfValue DataElementId="invasion_of_critical_structures" ComparisonValue="negative">no evidence of invasion of critical structures.&amp;nbsp;</SectionIfValue>
             <SectionIfValue DataElementId="invasion_of_critical_structures" ComparisonValue="possible">possible invasion of the carotid artery.&amp;nbsp;</SectionIfValue>
             <SectionIfValue DataElementId="invasion_of_critical_structures" ComparisonValue="probable">probable invasion of the prevertebral space.&amp;nbsp;</SectionIfValue>&amp;nbsp;
             </SectionIf>
             <SectionIf DataElementId="degreeofcertaintyforinvolvement">&amp;nbsp;
             NIRADS category&amp;nbsp;
             <InsertValue DataElementId="degreeofcertaintyforinvolvement"></InsertValue>
             </SectionIf>
           </ReportText>
         </ReportTexts>
       </EndPoint>`
     ];

    createGlobalDataElement();
    createIntegerDataElement();
    createChoiceDataElement();
    createMultiChoiceDataElement();

    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  function createGlobalDataElement() {
    globalDataElement = new GlobalValue();
    globalDataElement.currentValue = '10';
    globalDataElement.dataElementType = 'GlobalValue';
    globalDataElement.id = 'conditionConst';
    globalDataElement.isVisible = true;

    component.dataElements.push(globalDataElement);
  }

  function createIntegerDataElement() {
    numericDataElement = new NumericDataElement();
    numericDataElement.cdeId = '100';
    numericDataElement.currentValue = undefined;
    numericDataElement.dataElementType = 'IntegerDataElement';
    numericDataElement.defaultValue = undefined;
    numericDataElement.displaySequence = 3;
    numericDataElement.hint = 'Use longest dimension (improved clinical-radiologic correlation and adherence to staging systems)';
    numericDataElement.id = 'sizeoflargestcluster';
    numericDataElement.isRequired = true;
    numericDataElement.isVisible = true;
    numericDataElement.label = 'Size of largest cluster(in mm)';
    numericDataElement.minimum = 1;
    numericDataElement.maximum = undefined;

    component.dataElements.push(numericDataElement);
  }

  function createChoiceDataElement() {
    choiceDataElement = new ChoiceDataElement();
    choiceDataElement.cdeId = '100';
    choiceDataElement.currentValue = undefined;
    choiceDataElement.dataElementType = 'ChoiceDataElement';
    choiceDataElement.defaultValue = undefined;
    choiceDataElement.displaySequence = 1;
    choiceDataElement.hint = undefined;
    choiceDataElement.id = 'singlemultiple';
    choiceDataElement.isRequired = true;
    choiceDataElement.isVisible = true;
    choiceDataElement.label = 'Number of nodes';

    choiceDataElement.choiceInfo = [];

    choice = new Choice();
    choice.label = 'Single';
    choice.value = 'Single';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    choiceDataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'Multiple';
    choice.value = 'Multiple';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    choiceDataElement.choiceInfo.push(choice);

    component.dataElements.push(choiceDataElement);
  }

  function createMultiChoiceDataElement() {
    multiChoiceDataElement = new ChoiceDataElement();
    multiChoiceDataElement.choiceInfo = [];
    multiChoiceDataElement.cdeId = '100';
    multiChoiceDataElement.currentValue = undefined;
    multiChoiceDataElement.dataElementType = 'MultiChoiceDataElement';
    multiChoiceDataElement.defaultValue = undefined;
    multiChoiceDataElement.displaySequence = 4;
    multiChoiceDataElement.hint = undefined;
    multiChoiceDataElement.id = 'levelsinvolved';
    multiChoiceDataElement.isRequired = true;
    multiChoiceDataElement.isVisible = true;
    multiChoiceDataElement.label = 'Which levels involved?';

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

    choice = new Choice();
    choice.label = 'IV';
    choice.value = 'IV';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    multiChoiceDataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'V';
    choice.value = 'V';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    multiChoiceDataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'VIa';
    choice.value = 'VIa';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    multiChoiceDataElement.choiceInfo.push(choice);

    choice = new Choice();
    choice.label = 'VIb';
    choice.value = 'VIb';
    choice.default = false;
    choice.hint = undefined;
    choice.reportText = undefined;
    multiChoiceDataElement.choiceInfo.push(choice);

    component.dataElements.push(multiChoiceDataElement);
  }

  function initialiseEngineService() {
    template = new Template();
    template.dataElements = component.dataElements;
    template.xmlContent = component.xmlContent;
    template.endPointsString = component.endPointXMLString;
    template.templatePartial = component.templatePartial;
    template.metadata = createMetaData();
    template.rules = createRules();

    mockSimulatorEngineService.initialize(template);
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

  it('Created the AssistDataElementComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Created same instance for the Service injected via inject() and TestBed.get()',
    inject([SimulatorEngineService], (injectService: SimulatorEngineService) => {
      expect(injectService).toBe(mockSimulatorEngineService);
  }));

  it('Checked the creation of exact number of choice element, multichoice element and numeric element with empty data elements', () => {
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.ngOnInit();
    fixture.detectChanges();

    expect(reportData).toBeUndefined();
    expect(reportData).toBeFalsy();

    expect(nativeElement.querySelector('acr-assist-choice-element')).toBe(null);
    expect(nativeElement.querySelector('acr-assist-numeric-element')).toBe(null);
    expect(nativeElement.querySelector('acr-assist-multi-choice-element')).toBe(null);
  });

  it('Checked the creation of exact number of choice element, multichoice element and numeric element with data elements', () => {
    setTemplateData();
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.ngOnInit();
    fixture.detectChanges();

    expect(reportData).toBeUndefined();
    expect(reportData).toBeFalsy();

    // Checks the number of choice element component created
    expect(nativeElement.querySelector('acr-assist-choice-element')).not.toBe(null);
    expect(nativeElement.querySelectorAll('acr-assist-choice-element').length).toEqual(1);

    // Checks the number of numeric element component created
    expect(nativeElement.querySelector('acr-assist-numeric-element')).not.toBe(null);
    expect(nativeElement.querySelectorAll('acr-assist-numeric-element').length).toEqual(1);

    // Checks the number of multichoice element component created
    expect(nativeElement.querySelector('acr-assist-multi-choice-element')).not.toBe(null);
    expect(nativeElement.querySelectorAll('acr-assist-multi-choice-element').length).toEqual(1);

    // Checks the data elements
    expect(component.dataElements).toBeDefined();
    expect(component.dataElements).toBeTruthy();

    component.dataElements.forEach(element => {

      // Checks if dat aelement is of choice element type
      if (element instanceof ChoiceDataElement && element.dataElementType === 'ChoiceDataElement') {
        const choiceElement  = <ChoiceDataElement> element;

        expect(choiceElement.id).toBeDefined();
        expect(choiceElement.id).toBeTruthy();
        expect(choiceElement.dataElementType).toBeDefined();
        expect(choiceElement.dataElementType).toBeTruthy();
        expect(choiceElement.dataElementType).toEqual('ChoiceDataElement');
        expect(choiceElement.choiceInfo).toBeDefined();
        expect(choiceElement.choiceInfo).toBeTruthy();

        choiceElement.choiceInfo.forEach(elem => {
          expect(elem.label).toBeDefined();
          expect(elem.label).toBeTruthy();
          expect(elem.value).toBeDefined();
          expect(elem.value).toBeTruthy();
          expect(elem.reportText).toBeUndefined();
          expect(elem.default).toBeDefined();
          expect(elem.default).toBeFalsy();
        });

        // Checks if data element is of multi choice element type
      } else if (element instanceof ChoiceDataElement && element.dataElementType === 'MultiChoiceDataElement') {
        const multiChoiceElement  = <ChoiceDataElement> element;

        expect(multiChoiceElement.id).toBeDefined();
        expect(multiChoiceElement.id).toBeTruthy();
        expect(multiChoiceElement.dataElementType).toBeDefined();
        expect(multiChoiceElement.dataElementType).toBeTruthy();
        expect(multiChoiceElement.dataElementType).toEqual('MultiChoiceDataElement');
        expect(multiChoiceElement.choiceInfo).toBeDefined();
        expect(multiChoiceElement.choiceInfo).toBeTruthy();

        multiChoiceElement.choiceInfo.forEach(elem => {
          expect(elem.label).toBeDefined();
          expect(elem.label).toBeTruthy();
          expect(elem.value).toBeDefined();
          expect(elem.value).toBeTruthy();
          expect(elem.reportText).toBeUndefined();
          expect(elem.default).toBeDefined();
          expect(elem.default).toBeFalsy();
        });

        // Checks if data element is of integer element type
      } else if (element instanceof IntegerDataElement) {
        const integerDataElement  = <IntegerDataElement> element;

        expect(integerDataElement.id).toBeDefined();
        expect(integerDataElement.id).toBeTruthy();
        expect(integerDataElement.dataElementType).toBeDefined();
        expect(integerDataElement.dataElementType).toBeTruthy();
        expect(integerDataElement.dataElementType).toEqual('IntegerDataElement');
        expect(integerDataElement.label).toBeDefined();
        expect(integerDataElement.label).toBeTruthy();

        // Checks if data element is of global value type
      } else if (element instanceof GlobalValue) {
        const integerDataElement  = <GlobalValue> element;

        expect(integerDataElement.id).toBeDefined();
        expect(integerDataElement.id).toBeTruthy();
        expect(integerDataElement.dataElementType).toBeDefined();
        expect(integerDataElement.dataElementType).toBeTruthy();
        expect(integerDataElement.dataElementType).toEqual('GlobalValue');
        expect(integerDataElement.currentValue).toBeDefined();
        expect(integerDataElement.currentValue).toBeTruthy();
        expect(integerDataElement.isVisible).toBeDefined();
      }
    });

    // Checks the end point strings
    expect(component.endPointXMLString).toBeDefined();
    expect(component.endPointXMLString).toBeTruthy();

    // Checks the template partial
    expect(component.templatePartial).toBeDefined();
    expect(component.templatePartial).toBeTruthy();

     // Checks the xml content
     expect(component.xmlContent).toBeDefined();
     expect(component.xmlContent).toBeTruthy();
  });

  it('Called numericSelected(event) with a valid event to generate execution history', () => {
    setTemplateData();
    initialiseEngineService();

    const selectedCondition = new SelectedCondition();
    selectedCondition.selectedConditionId = 'sizeoflargestcluster';
    selectedCondition.selectedCondition = 'Size of largest cluster(in mm)';
    selectedCondition.selectedValue = '2';

    const numericElement = new NumericElement();
    numericElement.elementId = 'sizeoflargestcluster';
    numericElement.selectedValue = 2;

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    const event = { receivedElement: numericElement, selectedCondition: selectedCondition };

    component.numericSelected(event);

    // Checks the report text
    expect(reportData).toBeDefined();
    expect(reportData).toBeTruthy();
    expect(reportData instanceof MainReportText);

    expect(reportData.allReportText).toBeDefined();
    expect(reportData.allReportText).toBeTruthy();
    expect(reportData.allReportText instanceof AllReportText);
    expect(reportData.reportTextMainContent).toBeDefined();

    // Checks the execution history
    expect(executionHistory).toBeDefined();
    expect(executionHistory).toBeTruthy();
    expect(executionHistory instanceof FinalExecutedHistory);

    expect(executionHistory.executionHistories).toBeDefined();
    expect(executionHistory.executionHistories).toBeTruthy();
    expect(executionHistory.executionHistories instanceof ExecutedResultHistory);

    // Checks the execution history results
    expect(executionHistory.executionHistories[0].resultCondition).toBeDefined();
    expect(executionHistory.executionHistories[0].resultCondition).toBeTruthy();
    expect(executionHistory.executionHistories[0].resultCondition).toEqual(selectedCondition.selectedCondition);
    expect(executionHistory.executionHistories[0].resultValue).toBeDefined();
    expect(executionHistory.executionHistories[0].resultValue).toBeTruthy();
    expect(executionHistory.executionHistories[0].resultValue).toBe(numericElement.selectedValue.toString());

    // Checks the report text inside execution history
    expect(executionHistory.resultText).toBeDefined();
    expect(executionHistory.resultText).toBeTruthy();
    expect(executionHistory.resultText instanceof MainReportText);

    expect(executionHistory.resultText.allReportText).toBeDefined();
    expect(executionHistory.resultText.allReportText).toBeTruthy();
    expect(executionHistory.resultText.allReportText instanceof AllReportText);
    expect(executionHistory.resultText.reportTextMainContent).toBeDefined();

    // Checks whether report text and report text of execution history are equal
    expect(reportData).toEqual(executionHistory.resultText);
  });

  it('Called numericSelected(event) with a invalid event to generate execution history', () => {
    setTemplateData();
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    const event = { receivedElement: undefined, selectedCondition: undefined };

    component.numericSelected(event);

    // Checks the report text
    expect(reportData).toBeUndefined();

    // Checks the execution history
    expect(executionHistory).toBeUndefined();
  });

  it('Called choiceSelected(event) with a valid event to generate execution history', () => {
    setTemplateData();
    initialiseEngineService();

    const selectedCondition = new SelectedCondition();
    selectedCondition.selectedConditionId = 'singlemultiple';
    selectedCondition.selectedCondition = 'Number of nodes';
    selectedCondition.selectedValue = 'Single';

    const choiceElement = new ChoiceElement();
    choiceElement.elementId = 'singlemultiple';
    choiceElement.selectedValue = 'Single';
    choiceElement.selectedText = 'Single';

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    const event = { receivedElement: choiceElement, selectedCondition: selectedCondition };

    component.choiceSelected(event);

    // Checks the report text
    expect(reportData).toBeDefined();
    expect(reportData).toBeTruthy();
    expect(reportData instanceof MainReportText);

    expect(reportData.allReportText).toBeDefined();
    expect(reportData.allReportText).toBeTruthy();
    expect(reportData.allReportText instanceof AllReportText);
    expect(reportData.reportTextMainContent).toBeDefined();

    // Checks the execution history
    expect(executionHistory).toBeDefined();
    expect(executionHistory).toBeTruthy();
    expect(executionHistory instanceof FinalExecutedHistory);

    expect(executionHistory.executionHistories).toBeDefined();
    expect(executionHistory.executionHistories).toBeTruthy();
    expect(executionHistory.executionHistories instanceof ExecutedResultHistory);

    // Checks the execution history results
    expect(executionHistory.executionHistories[0].resultCondition).toBeDefined();
    expect(executionHistory.executionHistories[0].resultCondition).toBeTruthy();
    expect(executionHistory.executionHistories[0].resultCondition).toEqual(selectedCondition.selectedCondition);
    expect(executionHistory.executionHistories[0].resultValue).toBeDefined();
    expect(executionHistory.executionHistories[0].resultValue).toBeTruthy();
    expect(executionHistory.executionHistories[0].resultValue).toEqual(choiceElement.selectedValue);

    // Checks the report text inside execution history
    expect(executionHistory.resultText).toBeDefined();
    expect(executionHistory.resultText).toBeTruthy();
    expect(executionHistory.resultText instanceof MainReportText);

    expect(executionHistory.resultText.allReportText).toBeDefined();
    expect(executionHistory.resultText.allReportText).toBeTruthy();
    expect(executionHistory.resultText.allReportText instanceof AllReportText);
    expect(executionHistory.resultText.reportTextMainContent).toBeDefined();

    // Checks whether report text and report text of execution history are equal
    expect(reportData).toEqual(executionHistory.resultText);
  });

  it('Called choiceSelected(event) with a invalid event to generate execution history', () => {
    setTemplateData();
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    const event = { receivedElement: undefined, selectedCondition: undefined };

    component.choiceSelected(event);

    // Checks the report text
    expect(reportData).toBeUndefined();

    // Checks the execution history
    expect(executionHistory).toBeUndefined();
  });

  it('Called multiSelected(event) with a valid event to generate execution history', () => {
    setTemplateData();
    initialiseEngineService();

    const selectedCondition = new SelectedCondition();
    selectedCondition.selectedConditionId = 'levelsinvolved';
    selectedCondition.selectedCondition = 'Which levels involved?';
    selectedCondition.selectedValue = ['I', 'II', 'III'];

    const multiChoiceElement = new MultiChoiceElement();
    multiChoiceElement.elementId = 'levelsinvolved';
    multiChoiceElement.selectedValues = ['I', 'II', 'III'];
    multiChoiceElement.selectedTexts = ['I', 'II', 'III'];

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    const event = { receivedElement: multiChoiceElement, selectedCondition: selectedCondition };

    component.multiSelected(event);

    // Checks the report text
    expect(reportData).toBeDefined();
    expect(reportData).toBeTruthy();
    expect(reportData instanceof MainReportText);

    expect(reportData.allReportText).toBeDefined();
    expect(reportData.allReportText).toBeTruthy();
    expect(reportData.allReportText instanceof AllReportText);
    expect(reportData.reportTextMainContent).toBeDefined();

    // Checks the execution history
    expect(executionHistory).toBeDefined();
    expect(executionHistory).toBeTruthy();
    expect(executionHistory instanceof FinalExecutedHistory);

    expect(executionHistory.executionHistories).toBeDefined();
    expect(executionHistory.executionHistories).toBeTruthy();
    expect(executionHistory.executionHistories instanceof ExecutedResultHistory);

    // Checks the execution history results
    expect(executionHistory.executionHistories[0].resultCondition).toBeDefined();
    expect(executionHistory.executionHistories[0].resultCondition).toBeTruthy();
    expect(executionHistory.executionHistories[0].resultCondition).toEqual(selectedCondition.selectedCondition);
    expect(executionHistory.executionHistories[0].resultValue).toBeDefined();
    expect(executionHistory.executionHistories[0].resultValue).toBeTruthy();
    expect(executionHistory.executionHistories[0].resultValue).toEqual(multiChoiceElement.selectedValues);

    // Checks the report text inside execution history
    expect(executionHistory.resultText).toBeDefined();
    expect(executionHistory.resultText).toBeTruthy();
    expect(executionHistory.resultText instanceof MainReportText);

    expect(executionHistory.resultText.allReportText).toBeDefined();
    expect(executionHistory.resultText.allReportText).toBeTruthy();
    expect(executionHistory.resultText.allReportText instanceof AllReportText);
    expect(executionHistory.resultText.reportTextMainContent).toBeDefined();

        // Checks whether report text and report text of execution history are equal
    expect(reportData).toEqual(executionHistory.resultText);
  });

  it('Called multiSelected(event) with a invalid event to generate execution history', () => {
    setTemplateData();
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    const event = { receivedElement: undefined, selectedCondition: undefined };

    component.multiSelected(event);

    // Checks the report text
    expect(reportData).toBeUndefined();

    // Checks the execution history
    expect(executionHistory).toBeUndefined();
  });

  it('Called generateReportText(endpointId: string) with a valid endpoint', () => {
    setTemplateData();
    initialiseEngineService();

    const endPointId = template.rules.decisionPoints[0].branches[0].endPointRef.endPointId;

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.ngOnInit();

    const generateReportText = function () {
      try {
        component.generateReportText(endPointId);
      } catch (error) {
        throw error;
      }
    };
    expect(generateReportText).not.toThrow();
    expect(generateReportText).toBeDefined();

    // Checks the report text
    expect(reportData).toBeDefined();
    expect(reportData).toBeTruthy();
    expect(reportData instanceof MainReportText);

    expect(reportData.allReportText).toBeDefined();
    expect(reportData.allReportText).toBeTruthy();
    expect(reportData.allReportText instanceof AllReportText);
    expect(reportData.reportTextMainContent).toBeDefined();
  });

  it('Called generateReportText(endpointId: string) with a invalid endpoint', () => {
    setTemplateData();
    initialiseEngineService();

    const endPointId = 'macro';

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.ngOnInit();

    const generateReportText = function () {
      try {
        component.generateReportText(endPointId);
      } catch (error) {
        throw error;
      }
    };

    expect(generateReportText).toThrow();

    // Checks the report text
    expect(reportData).toBeUndefined();
  });

  it('Called generateReportText(endpointId: string) with a empty endpoint', () => {
    setTemplateData();
    initialiseEngineService();

    const endPointId = '';

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.ngOnInit();

    const generateReportText = function () {
      try {
        component.generateReportText(endPointId);
      } catch (error) {
        throw error;
      }
    };

    expect(generateReportText).toThrow();

    // Checks the report text
    expect(reportData).toBeUndefined();
  });

});
