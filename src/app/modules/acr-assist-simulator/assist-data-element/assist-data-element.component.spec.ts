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
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import { NumericDataElement } from '../../core/elements/models/numeric-data-element.model';
import { MultiChoiceDataElement } from '../../core/elements/models/multi-choice-data-element';
import { ChoiceDataElement } from '../../core/elements/models/choice-data-element-model';
import { Choice } from '../../core/elements/models/choice.model';
import { ChoiceInfo } from '../../core/elements/models/choiceInfo.model';
import { GlobalValue } from '../../core/elements/models/globalvalue.model';
import { By } from '@angular/platform-browser';
import { Template } from '../../core/models/template.model';
import { Metadata } from '../../core/metadata/models/metadata-model';
import { Diagram } from '../../core/models/diagram.model';
import { Rules } from '../../core/rules/models/rules.model';
import { DecisionPoint } from '../../core/models/decisionpoint.model';
import { Branch } from '../../core/models/branch.model';
import { EndPointRef } from '../../core/models/endpointref.model';
import { ConditionType } from '../../core/models/conditiontype.model';
import { EqualCondition } from '../../core/rules/equal-condition';
import { IntegerDataElement } from '../../core/elements/models/integer-data-element.model';
import { SelectedCondition } from '../../core/models/executed-result.model';

class MockSimulatorEngineService extends SimulatorEngineService {
}

class MockTemplateManagerService extends TemplateManagerService {
}

describe('AssistDataElementComponent', () => {
  let component: AssistDataElementComponent;
  let fixture: ComponentFixture<AssistDataElementComponent>;
  let nativeElement: any;
  let numericDataElement: NumericElement;
  let multiChoiceDataElement: MultiChoiceElement;
  let choiceDataElement: ChoiceElement;
  let globalDataElement: GlobalValue;
  let selectedCondition: SelectedCondition;
  let event: any;
  let template: Template;
  let choice: Choice;
  let reportData: any;
  let executionHistory: any;
  let mockSimulatorEngineService: SimulatorEngineService;
  let mockTemplateManagerService: TemplateManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AssistDataElementComponent, AssistChoiceElementComponent, AssistMultiChoiceElementComponent,
                      AssistNumericElementComponent, AssistReportTextComponent, HintDiagramComponent, ImageMapComponent,
                      SlideComponent, CarouselComponent ],
      providers: [{ provide: TemplateManagerService, useClass: MockTemplateManagerService },
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
       {provide: CreationServiceInjectorToken, useClass: ComputedDataElementCreationService, multi: true }]
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
    mockTemplateManagerService = TestBed.get(TemplateManagerService);

    fixture.detectChanges();
  });

  afterEach(() => {
    nativeElement = undefined;
    numericDataElement = undefined;
    multiChoiceDataElement = undefined;
    choiceDataElement = undefined;
    globalDataElement = undefined;
    selectedCondition = undefined;
    event = undefined;
    template = undefined;
    choice = undefined;
    reportData = undefined;
    executionHistory = undefined;
    mockSimulatorEngineService = undefined;
    mockTemplateManagerService = undefined;
  });

  function setTemplateDataOfLymph_Nodes() {
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

              <SectionIfValue DataElementId="levelsinvolved" ComparisonValue="I">&amp;nbsp;Levels : I</SectionIfValue>
              <SectionIfValueNot DataElementId="levelsinvolved" ComparisonValue="II">&amp;nbsp;Levels : I</SectionIfValueNot>

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

    template = mockTemplateManagerService.getTemplate(component.xmlContent);

    component.templatePartial = template.templatePartial;
    component.endPointXMLString = template.endPointsString;
    component.dataElements = template.dataElements;

    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  function setTemplateDataOfLungRads() {
    component.xmlContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-model href="../../XML Schema/ACRAssist_xml_schema.rnc" type="application/relax-ng-compact-syntax"?>
    <ReportingModule>
        <Metadata>
            <Label>Lung-RADS Cancer Screening</Label>
            <ID>Lung-RADS_1.0</ID>
            <SchemaVersion>1.0</SchemaVersion>
            <ModuleVersion>1.0</ModuleVersion>
            <Info>
                <Description>Lung-RADS-based cancer screening on CT</Description>
                <References>
                    <Citation PubmedId="24992501" Url="http://journals.lww.com/thoracicimaging/Citation/2014/09000/ACR_STR_Practice_Parameter_for_the_Performance_and.12.aspx">Kazerooni EA, Austin J, Black WC, Dyer DS, Hazelton T, Leung AN, McNitt-Gray MF, Munden RF, Pipavath S. ACR-STR Practice Parameter for the Performance and Reporting of Lung Cancer Screening Thoracic Computed Tomography (Resolution 4). Journal of Thoracic Imaging 2014;29(5):310-316</Citation>
                </References>
                <Diagrams>
                    <Diagram>
                        <Location>LungRADSCategorization.png</Location>
                        <Label>ACR Lung Imaging Reporting and Data System (Lung-RADS) Assessment Categories</Label>
                    </Diagram>
                </Diagrams>
                <Contact>
                    <Name>Tarik Alkasab, MD, PhD</Name>
                    <Email>talkasab@mgh.harvard.edu</Email>
                    <Institution>Massachusetts General Hospital, Harvard Medical School</Institution>
                </Contact>
            </Info>
            <ReportCitationText>Lung cancer screening categorization and recommendations per American College of Radiology Lung-RADS Version 1.0 (http://www.acr.org/Quality-Safety/Resources/LungRADS).</ReportCitationText>
            <ApplicableExams>
                <ApplicableExamCategory Axis="Modality">CT </ApplicableExamCategory>
                <ApplicableExamCategory Axis="Anatomy"> Chest </ApplicableExamCategory>
            </ApplicableExams>
            <ApplicableSexes Value="Both"/>
            <ApplicableAgeGroups>
                <MinimumAge>19</MinimumAge>
            </ApplicableAgeGroups>
            <VoiceActivation>
                <VoiceCommandPhrase>pulmonary nodule</VoiceCommandPhrase>
                <VoiceCommandPhrase>lung nodule</VoiceCommandPhrase>
                <VoiceCommandPhrase>ground-glass nodule</VoiceCommandPhrase>
                <VoiceCommandPhrase>part-solid nodule</VoiceCommandPhrase>
                <VoiceCommandPhrase>partly solid nodule</VoiceCommandPhrase>
                <VoiceCommandPhrase>solid nodule</VoiceCommandPhrase>
            </VoiceActivation>
        </Metadata>
        <DataElements>
            <ChoiceDataElement Id="baseCategory" DisplaySequence="3" IsRequired= "true" >
                <Label>Category of findings</Label>
                <Hint>Lung-RADS category</Hint>
                <ChoiceInfo>
                    <Choice>
                        <Value>cat0NoPriors</Value>
                        <Label>0: Prior CT being located</Label>
                        <Hint>Prior chest CT examin ation(s) being located for comparison</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat0NoEvaluation</Value>
                        <Label>0: Lungs cannot be evaluated</Label>
                        <Hint>Part or all of lungs cannot be evaluated</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat1NoLungNodules</Value>
                        <Label>1: No lung nodules</Label>
                        <Hint>No lung nodules</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat1NoduleSpecific</Value>
                        <Label>1: Nodule(s) with specific calc</Label>
                        <Hint>Nodule(s) with specific calcifications: complete, central, popcorn, 
    concentric rings and fat-containing nodules</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat2SolidNodule</Value>
                        <Label>2: Sol &lt;6 mm / new &lt;4 mm</Label>
                        <Hint>Solid nodule(s):
    &lt;6 mm
    new &lt;4 mm</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat2PartSolidNodule</Value>
                        <Label>2: Part-sol &lt;6mm </Label>
                        <Hint>Part solid nodule(s):
    &lt;6 mm total diameter on baseline screening</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat2NonSolidNodule</Value>
                        <Label>2: GGN &lt;20mm / &gt;=20mm slow grow</Label>
                        <Hint>Non-solid nodul(s) (GGN):
    &lt;20 mm OR
    &gt;=20 mm and unchanged or slowly growing</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat2NodulesUnchanged</Value>
                        <Label>2: Cat 3/4 stable &gt;=3 mos</Label>
                        <Hint>Category 3 or 4 nodules unchanged for &gt;= 3 months</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat3SolidNodule</Value>
                        <Label>3: Sol &gt;=6-&lt;8mm / new 4-&lt;6mm</Label>
                        <Hint>Solid nodule(s):
    &gt;=6 to &lt;8 mm at baseline OR
    new 4 mm to &lt; 6 mm</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat3PartSolidNodule</Value>
                        <Label>3: Part-sol w sol &lt;6mm / new &lt;6mm</Label>
                        <Hint>Part solid nodule(s):
    &gt;6 mm total diameter with solid component &lt;6 mm OR
    new &lt;6 mm total diameter</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat3NonSolidNodule</Value>
                        <Label>3: GGN &gt;=20mm baseline or new</Label>
                        <Hint>Non-solid nodule(s) (GGN) &gt;=20 mm on baseline CT or new</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat4ASolidNodule</Value>
                        <Label>4A: Sol &gt;=8-&lt;15mm / growing &lt;8mm / new 6-&lt;8mm</Label>
                        <Hint>Solid nodule(s):
    &gt;=8 to &lt;15 mm at baseline OR
    growing &lt;8 mm OR
    new 6 to &lt;8 mm</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat4APartSolidNodule</Value>
                        <Label>4A: Part-sol w sol &gt;=6-&lt;8mm / &lt;4mm new/grow</Label>
                        <Hint>Part-solid Nodule(s):
    &gt;=6 mm with solid component &gt;=6 mm to &lt;8 mm OR
    with a new or growing &lt;4 mm solid component</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat4AEndobronchialNodule</Value>
                        <Label>4A: Endobronchial nodule</Label>
                        <Hint>Endobronchial nodule</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat4BSolidNodule</Value>
                        <Label>4B: Sol &gt;=15 mm / new or growing &gt;=8mm</Label>
                        <Hint>Solid nodule(s):
    &gt;= 15 mm OR
    new or growing, and &gt;= 8 mm</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat4BPartSolidNodule</Value>
                        <Label>4B: Part-sol w sol &gt;=8mm / new or growing sol &gt;=4mm</Label>
                        <Hint>Part-solid Nodule(s) with:
    a solid component &gt;= 8 mm OR
    a new or growing &gt;= 4 mm solid component</Hint>
                    </Choice>
                    <Choice>
                        <Value>cat4XMalignancy</Value>
                        <Label>4X: Cat 3/4 w susp features</Label>
                        <Hint>Category 3 or 4 nodules with additional features or imaging findings
    that increases the suspicion of malignancy</Hint>
                    </Choice>
                </ChoiceInfo>
                <ImageMap>
                    <Location>LURADSAssessementCategoriesModal.png</Location>
                    <Map>
                        <Area Shape="rect" Coords="243,47,630,65" ChoiceValue="cat0NoPriors"/>
                        <Area Shape="rect" Coords="243,66,630,83" ChoiceValue="cat0NoEvaluation"/>
                        <Area Shape="rect" Coords="243,84,630,104" ChoiceValue="cat1NoLungNodules"/>
                        <Area Shape="rect" Coords="243,104,630,132" ChoiceValue="cat1NoduleSpecific"/>
                        <Area Shape="rect" Coords="243,133,630,187" ChoiceValue="cat2SolidNodule"/>
                        <Area Shape="rect" Coords="243,188,630,223" ChoiceValue="cat2PartSolidNodule"/>
                        <Area Shape="rect" Coords="243,224,630,277" ChoiceValue="cat2NonSolidNodule"/>
                        <Area Shape="rect" Coords="243,278,630,298" ChoiceValue="cat2NodulesUnchanged"/>
                        <Area Shape="rect" Coords="243,299,630,352" ChoiceValue="cat3SolidNodule"/>
                        <Area Shape="rect" Coords="243,353,630,407" ChoiceValue="cat3PartSolidNodule"/>
                        <Area Shape="rect" Coords="243,408,630,425" ChoiceValue="cat3NonSolidNodule"/>
                        <Area Shape="rect" Coords="243,426,630,497" ChoiceValue="cat4ASolidNodule"/>
                        <Area Shape="rect" Coords="243,498,630,552" ChoiceValue="cat4APartSolidNodule"/>
                        <Area Shape="rect" Coords="243,553,630,570" ChoiceValue="cat4AEndobronchialNodule"/>
                        <Area Shape="rect" Coords="243,571,630,623" ChoiceValue="cat4BSolidNodule"/>
                        <Area Shape="rect" Coords="243,624,630,677" ChoiceValue="cat4BPartSolidNodule"/>
                        <Area Shape="rect" Coords="243,678,630,709" ChoiceValue="cat4XMalignancy"/>
                  </Map>
                </ImageMap>
            </ChoiceDataElement>
            
            <ComputedDataElement Id="hasSelectedBaseCategory">
                <DecisionPoint>
                    <Branch>
                        <OrCondition>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat0NoPriors"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat0NoEvaluation"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat1NoLungNodules"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat1NoduleSpecific"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2SolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2PartSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2NonSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2NodulesUnchanged"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3SolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3PartSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3NonSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4ASolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4APartSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4AEndobronchialNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4BPartNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4BPartSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4XMalignancy"/>
                        </OrCondition>
                        <TextExpression>true</TextExpression>
                    </Branch>
                    <DefaultBranch>
                        <TextExpression>false</TextExpression>
                    </DefaultBranch>
                </DecisionPoint>
            </ComputedDataElement>
            
            <ChoiceDataElement Id="singleOrMultiple" DisplaySequence="5">
                <Label>Single/multiple</Label>
                <ChoiceInfo>
                    <Choice IsDefault="true">
                        <Value>single</Value>
                        <Label>Single</Label>
                    </Choice>
                    <Choice>
                        <Value>multiple</Value>
                        <Label>Multiple</Label>
                    </Choice>
                </ChoiceInfo>
            </ChoiceDataElement>
            
            <ChoiceDataElement Id="significantAdditionalFindings" DisplaySequence="7" >
                <Label>Additional finding?</Label>
                <Hint>Clinically significant or potentially significant finding?</Hint>
                <ChoiceInfo>
                    <Choice IsDefault="true">
                        <Value>no</Value>
                        <Label>No</Label>
                    </Choice>
                    <Choice>
                        <Value>yes</Value>
                        <Label>Yes</Label>
                    </Choice>
                </ChoiceInfo>
            </ChoiceDataElement>
            
            <ComputedDataElement Id="significantAdditionalFindingsText">
                <DecisionPoint>
                    <Branch>
                        <EqualCondition DataElementId="significantAdditionalFindings" ComparisonValue="yes"/>
                        <TextExpression>There is a potentially significant incidental finding.</TextExpression>
                    </Branch>
                </DecisionPoint>
            </ComputedDataElement>
            
            <ChoiceDataElement Id="historyLungCancer" DisplaySequence="9" >
                <Label>Hx Lung Cancer?</Label>
          <Hint>Does the patient have a prior diagnosis of lung cancer?</Hint>
                <ChoiceInfo>
                    <Choice IsDefault="true">
                        <Value>no</Value>
                        <Label>No</Label>
                    </Choice>
                    <Choice>
                        <Value>yes</Value>
                        <Label>Yes</Label>
                    </Choice>
                </ChoiceInfo>
            </ChoiceDataElement>
            
            <ComputedDataElement Id="historyLungCancerText">
                <DecisionPoint>
                    <Branch>
                        <EqualCondition DataElementId="historyLungCancer" ComparisonValue="yes"/>
                        <TextExpression>There is a prior history of lung cancer.</TextExpression>
                    </Branch>
                </DecisionPoint>
            </ComputedDataElement>
            
            <ComputedDataElement Id="consolidatedCategory" ShowValue="false" DisplaySequence="14">
                <Label>Category</Label>
                <DecisionPoint>
                    <Branch>
                        <OrCondition>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat0NoPriors"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat0NoEvaluation"/>
                        </OrCondition>
                        <TextExpression>0</TextExpression>
                    </Branch>
                    <Branch>
                        <OrCondition>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat1NoLungNodules"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat1NoduleSpecific"/>
                        </OrCondition>
                        <TextExpression>1</TextExpression>
                    </Branch>
                    <Branch>
                        <OrCondition>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2SolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2PartSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2NonSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2NodulesUnchanged"/>
                        </OrCondition>
                        <TextExpression>2</TextExpression>
                    </Branch>
                    <Branch>
                        <OrCondition>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3SolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3PartSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3NonSolidNodule"/>
                        </OrCondition>
                        <TextExpression>3</TextExpression>
                    </Branch>
                    <Branch>
                        <OrCondition>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4ASolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4APartSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4AEndobronchialNodule"/>
                        </OrCondition>
                        <TextExpression>4A</TextExpression>
                    </Branch>
                    <Branch>
                        <OrCondition>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4BSolidNodule"/>
                            <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4BPartSolidNodule"/>
                        </OrCondition>
                        <TextExpression>4B</TextExpression>
                    </Branch>
                    <Branch>
                        <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4XMalignancy"/>
                        <TextExpression>4X</TextExpression>
                    </Branch>
                </DecisionPoint>
            </ComputedDataElement>
            
            <ComputedDataElement Id="categoryWithSModifier">
                <DecisionPoint>
                    <Branch>
                        <EqualCondition DataElementId="significantAdditionalFindings" ComparisonValue="yes"/>
                        <TextExpression>{consolidatedCategory}/S</TextExpression>
                    </Branch>
                    <DefaultBranch>
                        <TextExpression>{consolidatedCategory}</TextExpression>
                    </DefaultBranch>
                </DecisionPoint>
            </ComputedDataElement>
            
            <ComputedDataElement Id="categoryWithModifiers">
                <DecisionPoint>
                    <Branch>
                        <EqualCondition DataElementId="historyLungCancer" ComparisonValue="yes"/>
                        <DecisionPoint>
                            <Branch>
                                <EqualCondition DataElementId="significantAdditionalFindings" ComparisonValue="yes"/>
                                <TextExpression>{categoryWithSModifier}C</TextExpression>
                            </Branch>
                            <DefaultBranch>
                                <TextExpression>{categoryWithSModifier}/C</TextExpression>
                            </DefaultBranch>
                        </DecisionPoint>
                    </Branch>
                    <DefaultBranch>
                        <TextExpression>{categoryWithSModifier}</TextExpression>
                    </DefaultBranch>
                </DecisionPoint>
            </ComputedDataElement>
        </DataElements>
      
        <Rules>
            
          <DecisionPoint Id="categorydp1">
              <Label>Category of findings?</Label>
              <Branch>
                  <Label>0: Prior CT being located</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat0NoPriors"/>
                  <EndPointRef EndPointId="cat0NoPriorsEp"/>
              </Branch>
              
              <!-- B -->
              <Branch>
                  <Label>0: Lungs cannot be evaluated</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat0NoEvaluation"/>
                  <EndPointRef EndPointId="cat0NoEvaluationEp"/>
              </Branch>
              
              <!-- C -->
              <Branch>
                  <Label>1: No lung nodules</Label>
                  <NotRelevantDataElements>
                      <DataElementRef DataElementId="singleOrMultiple"/>
                  </NotRelevantDataElements>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat1NoLungNodules"/>
                  <EndPointRef EndPointId="cat1NoLungNodulesEp"/>
              </Branch>
              
              <!-- D -->
              <Branch>
                  <Label>1: Nodule(s) with specific calc</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat1NoduleSpecific"/>
                  <EndPointRef EndPointId="cat1NoduleSpecificEp"/>
              </Branch>
              
              <!-- E -->
              <Branch>
                  <Label>2: Sol &lt;6 mm / new &lt;4 mm</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2SolidNodule"/>
                  <EndPointRef EndPointId="cat2SolidNoduleEp"/>
              </Branch>
              
              <!-- F -->
              <Branch>
                  <Label>2: Part-sol &lt;6mm</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2PartSolidNodule"/>
                  <EndPointRef EndPointId="cat2PartSolidNoduleEp"/>
              </Branch>
              
              <!-- G -->
              <Branch>
                  <Label>2: GGN &lt;20mm / &gt;=20mm slow grow</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2NonSolidNodule"/>
                  <EndPointRef EndPointId="cat2NonSolidNoduleEp"/>
              </Branch>
              
              <!-- H -->
              <Branch>
                  <Label>2: Cat 3/4 stable &gt;=3 mos</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat2NodulesUnchanged"/>
                  <EndPointRef EndPointId="cat2NodulesUnchangedEp"/>
              </Branch>
              
              <!-- I -->
              <Branch>
                  <Label>3: Sol &gt;=6-&lt;8mm / new 4-&lt;6mm</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3SolidNodule"/>
                  <EndPointRef EndPointId="cat3SolidNoduleEp"/>
              </Branch>
              
              <!-- J -->
              <Branch>
                  <Label>3: Part-sol w sol &lt;6mm / new &lt;6mm</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3PartSolidNodule"/>
                  <EndPointRef EndPointId="cat3PartSolidNoduleEp"/>
              </Branch>
              
              <!-- K -->
              <Branch>
                  <Label>3: GGN &gt;=20mm baseline or new</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat3NonSolidNodule"/>
                  <EndPointRef EndPointId="cat3NonSolidNoduleEp"/>
              </Branch>
              
              <!-- L -->
              <Branch>
                  <Label>4A: Sol &gt;=8-&lt;15mm / growing &lt;8mm / new 6-&lt;8mm</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4ASolidNodule"/>
                  <EndPointRef EndPointId="cat4ASolidNoduleEp"/>
              </Branch>
              
              <!-- M -->
              <Branch>
                  <Label>4A: Part-sol w sol &gt;=6-&lt;8mm / &lt;4mm new/grow</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4APartSolidNodule"/>
                  <EndPointRef EndPointId="cat4APartSolidNoduleEp"/>
              </Branch>
              
              <!-- N -->
              <Branch>
                  <Label>4A: Endobronchial nodule</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4AEndobronchialNodule"/>
                  <EndPointRef EndPointId="cat4AEndobronchialNoduleEp"/>
              </Branch>
              
              <!-- O -->
              <Branch>
                  <Label>4B: Sol &gt;=15 mm / new or growing &gt;=8mm</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4BSolidNodule"/>
                  <EndPointRef EndPointId="cat4BSolidNoduleEp"/>
              </Branch>
              
              <!-- P -->  
              <Branch>
                  <Label>4B: Part-sol w sol &gt;=8mm / new or growing sol &gt;=4mm</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4BPartSolidNodule"/>
                  <EndPointRef EndPointId="cat4BPartSolidNoduleEp"/>
              </Branch>
              
              <!-- Q -->
              <Branch>
                  <Label>4X: Cat 3/4 w susp features</Label>
                  <EqualCondition DataElementId="baseCategory" ComparisonValue="cat4XMalignancy"/>
                  <EndPointRef EndPointId="cat4XMalignancyEp"/>
              </Branch>
              
          </DecisionPoint>
                  <!-- A -->
        </Rules>
      
        <EndPoints>
            <TemplatePartial Id="multipleNodulesTp">
                <SectionIfValue DataElementId="singleOrMultiple" ComparisonValue="multiple">
                    Multiple pulmonary nodules.
                </SectionIfValue>
            </TemplatePartial>

            <TemplatePartial Id="identifiedOrDominantTp">
                <SectionIfValue DataElementId="singleOrMultiple" ComparisonValue="multiple">category-determining</SectionIfValue>
                <SectionIfValueNot DataElementId="singleOrMultiple" ComparisonValue="multiple">identified</SectionIfValueNot>
            </TemplatePartial>
            
            <TemplatePartial Id="noduleBenignCalcificationsTp">
                <SectionIfValue DataElementId="singleOrMultiple" ComparisonValue="multiple">nodules have benign calcifications</SectionIfValue>
                <SectionIfValueNot DataElementId="singleOrMultiple" ComparisonValue="multiple">nodule has benign calcification</SectionIfValueNot>
            </TemplatePartial>

            <TemplatePartial Id="cat0ManagementTp">
                Additional lung cancer screening CT images and/or comparison to prior chest CT examination.
            </TemplatePartial>
            
            <TemplatePartial Id="cat12ManagementTp">
                Continue annual screening with low-dose chest CT in 12 months.
            </TemplatePartial>
            
            <TemplatePartial Id="cat3ManagementTp">
                Follow up low-dose chest CT in 6 months.
            </TemplatePartial>
            
            <TemplatePartial Id="cat4AManagementTp">
                Follow-up low dose chest CT in 3 months or (for nodules with solid component 8 mm or larger) PET/CT.
            </TemplatePartial>

            <TemplatePartial Id="cat4ASuspiciousTp">suspicious for malignancy (probability 5-15%)</TemplatePartial>

            <TemplatePartial Id="cat4BSuspiciousTp">suspicious for malignancy (probability greater than 15%)</TemplatePartial>

            <TemplatePartial Id="cat4BXManagementTp">
                Tissue sampling, chest CT with or without contrast, or (for nodules with solid component 8 mm or larger) PET/CT.
            </TemplatePartial>
            
            <!-- A -->
            <EndPoint Id="cat0NoPriorsEp">
                <Label>A</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. The prior chest CT examination is being located for comparison.
                    </ReportText>
                    <ReportText SectionId="recommendation">Comparison to prior chest CT examination.</ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. The prior chest CT examination is being located for comparison. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/> 
                        <InsertValue DataElementId="historyLungCancerText"/> 
                        Recommendation: Comparison to prior chest CT examination.
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- B -->
            <EndPoint Id="cat0NoEvaluationEp">
                <Label>B</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. Part or all of the lungs cannot be evaluated. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation">Additional lung cancer screening CT images.</ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. Part or all of the lungs cannot be evaluated. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/> 
                        <InsertValue DataElementId="historyLungCancerText"/> 
                        Recommendation: Additional lung cancer screening CT images.
                    </ReportText>
                </ReportTexts>
            </EndPoint>
          
            <!-- C -->
            <EndPoint Id="cat1NoLungNodulesEp">
                <Label>C</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. Negative study as there are no nodules present.  The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/> 
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat12ManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. Negative study as there are no nodules present.  The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/> 
                        <InsertValue DataElementId="historyLungCancerText"/> 
                        Recommendation: <InsertPartial PartialId="cat12ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>
            
            <!-- D -->
            <EndPoint Id="cat1NoduleSpecificEp">
                <Label>D</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. Negative study as the identified <InsertPartial PartialId="noduleBenignCalcificationsTp"/>. The probability of malignancy is less than 1%.  
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat12ManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. Negative study as the identified  <InsertPartial PartialId="noduleBenignCalcificationsTp"/>. The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/> 
                        <InsertValue DataElementId="historyLungCancerText"/> 
                        Recommendation: <InsertPartial PartialId="cat12ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- E -->
            <EndPoint Id="cat2SolidNoduleEp">
                <Label>E</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> solid nodule has a very low likelihood of becoming a clinically active cancer, due to size and/or lack of growth. The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat12ManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> solid nodule has a very low likelihood of becoming a clinically active cancer, due to size and/or lack of growth. The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/> 
                        <InsertValue DataElementId="historyLungCancerText"/> 
                        Recommendation: <InsertPartial PartialId="cat12ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>
          
            <!-- F -->
            <EndPoint Id="cat2PartSolidNoduleEp">
                <Label>F</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> partly-solid nodule has a very low likelihood of becoming a clinically active cancer, due to size. The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation">Follow up low dose Chest CT in 12 months is recommended.</ReportText>
                    <ReportText SectionId="impressionRecommendation">Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> partly-solid nodule has a very low likelihood of becoming a clinically active cancer, due to size. The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat12ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- G -->
            <EndPoint Id="cat2NonSolidNoduleEp">
                <Label>G</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> non-solid nodule has a very low likelihood of becoming a clinically active cancer, due to size or lack of growth. The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat12ManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> non-solid nodule has a very low likelihood of becoming a clinically active cancer, due to size or lack of growth. The probability of malignancy is less than 1%. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat12ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- H -->
            <EndPoint Id="cat2NodulesUnchangedEp">
                <Label>H</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> In view of the stability of findings for 3 months, the nodule has reverted to category 2 with very low likelihood of becoming a clinically active cancer, due to lack of growth. The probability of malignancy is less than 1%.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat12ManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> In view of the stability of findings for 3 months, the nodule has reverted to category 2 with very low likelihood of becoming a clinically active cancer, due to lack of growth. The probability of malignancy is less than 1%.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat12ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- I -->
            <EndPoint Id="cat3SolidNoduleEp">
                <Label>I</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> solid nodule is probably benign, with a low likelihood of becoming a clinically active cancer. The probability of malignancy is 1-2%.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat3ManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> solid nodule is probably benign, with a low likelihood of becoming a clinically active cancer. The probability of malignancy is 1-2%.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat3ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- J -->
            <EndPoint Id="cat3PartSolidNoduleEp">
                <Label>J</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> partly solid nodule is probably benign, with a low likelihood of becoming a clinically active cancer. The probability of malignancy is 1-2%.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat3ManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> partly solid nodule is probably benign, with a low likelihood of becoming a clinically active cancer. The probability of malignancy is 1-2%.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat3ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- K -->
            <EndPoint Id="cat3NonSolidNoduleEp">
                <Label>K</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> non-solid nodule is probably benign, with a low likelihood of becoming a clinically active cancer. The probability of malignancy is 1-2%.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat3ManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> non-solid nodule is probably benign, with a low likelihood of becoming a clinically active cancer. The probability of malignancy is 1-2%.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat3ManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- L -->
            <EndPoint Id="cat4ASolidNoduleEp">
                <Label>L</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. 
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> solid nodule is <InsertPartial PartialId="cat4ASuspiciousTp"/>. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat4AManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. 
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> solid nodule is <InsertPartial PartialId="cat4ASuspiciousTp"/>. 
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat4AManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>
          
            <!-- M -->
            <EndPoint Id="cat4APartSolidNoduleEp">
                <Label>M</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>.
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> part-solid nodule is <InsertPartial PartialId="cat4ASuspiciousTp"/>.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat4AManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>.
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> part-solid nodule is <InsertPartial PartialId="cat4ASuspiciousTp"/>.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat4AManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- N -->
            <EndPoint Id="cat4AEndobronchialNoduleEp">
                <Label>N</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>.
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> endobronchial nodule is <InsertPartial PartialId="cat4ASuspiciousTp"/>.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat4AManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>.
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> endobronchial nodule is <InsertPartial PartialId="cat4ASuspiciousTp"/>.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat4AManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- O -->
            <EndPoint Id="cat4BSolidNoduleEp">
                <Label>O</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>.
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> solid nodule is <InsertPartial PartialId="cat4BSuspiciousTp"/>.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat4BXManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>.
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> solid nodule is <InsertPartial PartialId="cat4BSuspiciousTp"/>.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat4BXManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>
            
            <!-- P -->
            <EndPoint Id="cat4BPartSolidNoduleEp">
                <Label>P</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>.
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/>  part-solid nodule is <InsertPartial PartialId="cat4ASuspiciousTp"/>.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat4BXManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>.
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/>  part-solid nodule is <InsertPartial PartialId="cat4BSuspiciousTp"/>.
                        <InsertValue DataElementId="significantAdditionalFindingsText"/>
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat4BXManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

            <!-- Q -->
            <EndPoint Id="cat4XMalignancyEp">
                <Label>Q</Label>
                <ReportTexts>
                    <ReportText SectionId="impression">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. 
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> nodule demonstrates additional features or imaging findings that increase the suspicion for malignancy (probability greater than 15%).
                        <InsertValue DataElementId="significantAdditionalFindingsText"/> 
                        <InsertValue DataElementId="historyLungCancerText"/>
                    </ReportText>
                    <ReportText SectionId="recommendation"><InsertPartial PartialId="cat4BXManagementTp"/></ReportText>
                    <ReportText SectionId="impressionRecommendation">
                        Lung-RADS Category: <InsertValue DataElementId="categoryWithModifiers"/>. 
                        <InsertPartial PartialId="multipleNodulesTp"/> The <InsertPartial PartialId="identifiedOrDominantTp"/> nodule demonstrates additional features or imaging findings that increase the suspicion for malignancy (probability greater than 15%).
                        <InsertValue DataElementId="significantAdditionalFindingsText"/> 
                        <InsertValue DataElementId="historyLungCancerText"/>
                        Recommendation: <InsertPartial PartialId="cat4BXManagementTp"/>
                    </ReportText>
                </ReportTexts>
            </EndPoint>

        </EndPoints>
    </ReportingModule>`;

    template = mockTemplateManagerService.getTemplate(component.xmlContent);

    component.templatePartial = template.templatePartial;
    component.endPointXMLString = template.endPointsString;
    component.dataElements = template.dataElements;

    component.imagePath = 'XMLFiles/Samples/Hello Assist';
  }

  function setTemplateDataOfLirads() {
    component.xmlContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-model href="../../XML Schema/ACRAssist_xml_schema.rnc" type="application/relax-ng-compact-syntax"?>
    <ReportingModule>
      <Metadata>
        <Label>ACR LI-RADS</Label>
        <ID>ACR_LI_RADS</ID>
        <SchemaVersion>1.0</SchemaVersion>
        <ModuleVersion>2.0</ModuleVersion>
        <Info>
          <Description>This module can be used for characterizing liver lesion for
            MRI</Description>
          <References>
            <Citation Url="https://nrdr.acr.org/lirads/"> ACR LI-RADS demostrator </Citation>
            <Citation Url="https://nrdr.acr.org/liradsapp/"> </Citation>
          </References>
          <Diagrams>
            <Diagram DisplaySequence="1" IsKeyDiagram="true">
              <Location>KeyDiagram.png</Location>
              <Label>ACR LI-RADS</Label>
            </Diagram>
            <Diagram DisplaySequence="2">
              <Location>Treated.png</Location>
              <Label>Treated Objservation</Label>
            </Diagram>
            <Diagram DisplaySequence="3">
              <Location>tiv.png</Location>
              <Label>TIV</Label>
            </Diagram>
            <Diagram DisplaySequence="4">
              <Location>lr4_5.PNG</Location>
              <Label>TIV</Label>
            </Diagram>
          </Diagrams>
          <Contact>
            <Name>ACR Assist</Name>
            <Email>acr-assist@acr.org</Email>
            <Institution>American College of Radiology</Institution>
          </Contact>
        </Info>
        <ReportCitationText/>
        <Ontology>
          <AnatomicRegions CodingSystem="http://radlex.org/">
            <Region Code="RID58"> Liver </Region>
          </AnatomicRegions>
          <PossibleDiagnoses>
            <Diagnosis Code="RID4271">Hepatocellular carcinoma</Diagnosis>
          </PossibleDiagnoses>
        </Ontology>
        <ApplicableExams>
          <ApplicableExamCategory Axis="Modality">MRI </ApplicableExamCategory>
          <ApplicableExamCategory Axis="Anatomy"> LIver </ApplicableExamCategory>

        </ApplicableExams>
        <ApplicableSexes Value="Both"/>
        <ApplicableAgeGroups>
          <MinimumAge>19</MinimumAge>
        </ApplicableAgeGroups>
        <TextCues>
          <ContextPhrases>
            <ContextPhrase/>
          </ContextPhrases>
          <KeyWords>
            <KeyWord>LIRADS Liver lesion</KeyWord>
          </KeyWords>
          <NegationPhrases>
            <NegationPhrase/>
          </NegationPhrases>
          <Regex/>
        </TextCues>
        <VoiceActivation>
          <VoiceCommandPhrase>LIRADS</VoiceCommandPhrase>
          <VoiceCommandPhrase>Liver lesion</VoiceCommandPhrase>
          <VoiceCommandPhrase>American College of Radiology</VoiceCommandPhrase>
        </VoiceActivation>
      </Metadata>
      
      <DataElements>

        <GlobalValue Id="diameterSmall">10</GlobalValue>

        <GlobalValue Id="diameterLarge">20</GlobalValue>
        
        <IntegerDataElement Id="observationnumber" IsRequired="true" DisplaySequence="2">
          <Label>Observation#</Label>
          <Minimum>1</Minimum>
        </IntegerDataElement>
        
        <IntegerDataElement Id="seriesnumber" IsRequired="true" DisplaySequence="3">
          <Label>Series#</Label>
          <Minimum>1</Minimum>
        </IntegerDataElement>
        
        <IntegerDataElement Id="imagenumber" IsRequired="true" DisplaySequence="4">
          <Label>Image#</Label>
          <Minimum>1</Minimum>
        </IntegerDataElement>
        
        <ChoiceDataElement Id="segmentlocation" IsRequired="true" DisplaySequence="5" AllowFreetext="true">
          <Label>Segment#</Label>
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
              <Value>IVa</Value>
              <Label>IVa</Label>
            </Choice>
            <Choice>
              <Value>IVb</Value>
              <Label>IVb</Label>
            </Choice>
            <Choice>
              <Value>V</Value>
              <Label>V</Label>
            </Choice>
            <Choice>
              <Value>VI</Value>
              <Label>VI</Label>
            </Choice>
            <Choice>
              <Value>VII</Value>
              <Label>VII</Label>
            </Choice>
            <Choice>
              <Value>VIII</Value>
              <Label>VIII</Label>
            </Choice>
            <Choice>
              <Value>Left_lateral_sector</Value>
              <Label>Left lateral sector</Label>
            </Choice>
            <Choice>
              <Value>Left_medial_sector </Value>
              <Label>Left medial sector </Label>
            </Choice>
            <Choice>
              <Value>Right_Anterior_sector </Value>
              <Label>Right anterior sector </Label>
            </Choice>
            <Choice>
              <Value>Right_Posterior_sector </Value>
              <Label>Right posterior sector </Label>
            </Choice>
            <Choice>
              <Value>Left_lobe</Value>
              <Label>Left lobe</Label>
            </Choice>
            <Choice>
              <Value>Right_lobe</Value>
              <Label>Right lobe</Label>
            </Choice>
            <Choice>
              <Value>Uncertain</Value>
              <Label>Uncertain</Label>
            </Choice>
            <Choice>
              <Value>Unknown</Value>
              <Label>Unknown</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        
        <ChoiceDataElement Id="observationinPatient" IsRequired="true" CdeId="RDE65" DisplaySequence="6">
          <Label>Observation in high-risk patient</Label>
          <ChoiceInfo>
            <Choice>
              <Value>treated</Value>
              <Label>Treated observation</Label>
            </Choice>
            <Choice>
              <Value>untreated</Value>
              <Label>Untreated observation</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        
        <MultiChoiceDataElement Id="TreatmentMethod" IsRequired="true" DisplaySequence="7">
          <Label>Treatment method</Label>
          <ChoiceInfo>
            <Choice>
              <Value>Ablation_Type_Unknown</Value>
              <Label>Ablation - type not specified</Label>
            </Choice>
            <Choice>
              <Value>RF_ablation</Value>
              <Label>RF ablation</Label>
            </Choice>
            <Choice>
              <Value>Microwave_ablation</Value>
              <Label>Microwave ablation</Label>
            </Choice>
            <Choice>
              <Value>Cryoablation</Value>
              <Label>Cryoablation</Label>
            </Choice>
            <Choice>
              <Value>Alcohol_ablation</Value>
              <Label>Alcohol ablation</Label>
            </Choice>
            <Choice>
              <Value>embolization_Type_unknown</Value>
              <Label>Embolization - type not specified</Label>
            </Choice>
            <Choice>
              <Value>Chemoembolization</Value>	 
              <Label>Chemoembolization</Label>
            </Choice>
            <Choice>
              <Value>Y-90</Value>
              <Label>Y-90</Label>
            </Choice>
            <Choice>
              <Value>SBRT</Value>
              <Label>SBRT</Label>
            </Choice>
            <Choice>
              <Value>Other</Value>
              <Label>Other</Label>
            </Choice>
          </ChoiceInfo>
        </MultiChoiceDataElement>
        
        <ChoiceDataElement Id="pretreatmentCategory" IsRequired="true" DisplaySequence="8" AllowFreetext="true">
          <Label>What is the pretreatment category?</Label>
          <ChoiceInfo>
            <Choice>
              <Value>LR-1</Value>
              <Label>LR-1</Label>
            </Choice>
            <Choice>
              <Value>LR-2</Value>
              <Label>LR-2</Label>
            </Choice>
            <Choice>
              <Value>LR-3</Value>
              <Label>LR-3</Label>
            </Choice>
            <Choice>
              <Value>LR-4</Value>
              <Label>LR-4</Label>
            </Choice>
            <Choice>
              <Value>LR-5</Value>
              <Label>LR-5</Label>
            </Choice>
            <Choice>
              <Value>LR-TIV</Value>
              <Label>LR-TIV</Label>
            </Choice>
            <Choice>
              <Value>Path-HCC</Value>
              <Label>Path-HCC</Label>
            </Choice>
            <Choice>
              <Value>Path-Intrahepatic_Cholangiocarcinoma</Value>
              <Label>Path-Intrahepatic cholangiocarcinoma</Label>
            </Choice>
            <Choice>
              <Value>Unknown</Value>
              <Label>Unknown</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        
        
        <NumericDataElement Id="pretreatmentsize" IsRequired="true" DisplaySequence="10">
          <Label>What is the pretreatment size in mm?</Label>
          <Minimum>1</Minimum>
        </NumericDataElement>

        <ChoiceDataElement Id="untreatedobservation" IsRequired="true" DisplaySequence="11">
          <Label>Untreated observation without pathologic proof in patient at high-risk for
            HCC</Label>
          <Hint> Observation: generically applies to any apparent abnormality detected at
            imaging. As a generic term, it is preferred over lesion or nodule, since some
            observations (e.g. perfusion alterations, artifacts) may represent pseudolesions
            rather than true lesions or nodules</Hint>
          <Diagrams>
            <Diagram>
              <Location>observation.png</Location>
              <Label>observation</Label>
            </Diagram>
            <Diagram>
              <Location>patientathccrisk.PNG</Location>
              <Label>Patient at high-risk for HCC</Label>
            </Diagram>
            <Diagram>
              <Location>tumorinvein.PNG</Location>
              <Label>Tumor in vein</Label>
            </Diagram>
          </Diagrams>
          <VoiceCommand>Untreated observation without pathologic proof in patient at high-risk for
            HCC</VoiceCommand>
          <ChoiceInfo>
            <Choice>
              <Value>notcategorized</Value>
              <Label>Cannot be categorized due to image degradation or omission</Label>
              <Hint>due to image omission or degradation</Hint>
            </Choice>

            <Choice>
              <Value>tumorInVein</Value>
              <Label>Tumor in vein</Label>
              <Hint>Unequivocal enhancing soft tissue in vein, regardless of visualization of
                parenchymal mass</Hint>
            </Choice>

            <Choice>
              <Value>definitelyBenign</Value>
              <Label>Definitely benign</Label>
              <Hint> Cyst 
                Hemangioma 
                Perfusion alteration 
                Hepatic fat deposition
                Focal fat sparing 
                Hypertrophic pseudomass 
                Confluent fibrosis 
                Focal scar
                
              </Hint>
            </Choice>

            <Choice>
              <Value>probablyBenign</Value>
              <Label>Probably benign</Label>
              <Hint>Cyst 
                Hemangioma 
                Perfusion alteration 
                Hepatic fat deposition
                Focal fat sparing 
                Hypertrophic pseudomass 
                Confluent fibrosis 
                Focal scar						
                Distinctive nodule without malignant imaging features
                
              </Hint>
            </Choice>

            <Choice>
              <Value>malignantbutnothcc</Value>
              <Label>Probably or definitely malignant but not HCC specific</Label>
              <Hint>e.g., if targetoid</Hint>
            </Choice>

            <Choice>
              <Value>nonofabove</Value>
              <Label>Otherwise</Label>
            </Choice>

          </ChoiceInfo>
        </ChoiceDataElement>

        <ChoiceDataElement Id="treatedobservation" IsRequired="true" DisplaySequence="12">
          <Label>Treated observation features</Label>
          <Diagrams>
            <Diagram>
              <Location>treatedobservationcannotevaluated.png</Location>
              <Label>Treatment response cannot be evaluated due image degradation or
                omission</Label>
            </Diagram>
          </Diagrams>
          <ChoiceInfo>
            <Choice>
              <Value>LRTRNonevaluable</Value>
              <Label>If treatment response cannot be evaluated due image degradation or omission</Label>
            </Choice>
            <Choice>
              <Value>otherwise</Value>
              <Label>Otherwise</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        
        <ChoiceDataElement Id="LR1Features" IsRequired="false" DisplaySequence="13" AllowFreetext="true">
          <Label>LR-1 diagnosis</Label>
          <ChoiceInfo>
            <Choice>
              <Value>Cyst</Value>
              <Label>Cyst</Label>
            </Choice>
            <Choice>
              <Value>Hemangioma</Value>
              <Label>Hemangioma</Label>
            </Choice>
            <Choice>
              <Value>Perfusion_alteration</Value>
              <Label>Perfusion alteration</Label>
            </Choice>
            <Choice>
              <Value>Hepatic_fat_deposition</Value>
              <Label>Hepatic fat deposition</Label>
            </Choice>
            <Choice>
              <Value>Focal_fat_sparing</Value>
              <Label>Focal fat sparing</Label>
            </Choice>
            <Choice>
              <Value>Hypertrophic_pseudomass</Value>
              <Label>Hypertrophic pseudomass</Label>
            </Choice>
            <Choice>
              <Value>Confluent_fibrosis</Value>
              <Label>Confluent fibrosis</Label>
            </Choice>
            <Choice>
              <Value>Focal_scar</Value>
              <Label>Focal scar</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
        
        <ChoiceDataElement Id="LR2features" DisplaySequence="14" IsRequired="false" AllowFreetext="true">
          <Label>LR-2 diagnosis</Label>
          <ChoiceInfo>
            <Choice>
              <Value>Cyst</Value>
              <Label>Probable cyst</Label>
            </Choice>
            <Choice>
              <Value>Hemangioma</Value>
              <Label>Probable hemangioma</Label>
            </Choice>
            <Choice>
              <Value>Perfusion_alteration</Value>
              <Label>Probable perfusion alteration</Label>
            </Choice>
            <Choice>
              <Value>Hepatic_fat_deposition</Value>
              <Label>Probable hepatic fat deposition</Label>
            </Choice>
            <Choice>
              <Value>Focal_fat_sparing</Value>
              <Label>Probable focal fat sparing</Label>
            </Choice>
            <Choice>
              <Value>Hypertrophic_pseudomass</Value>
              <Label>Probable hypertrophic pseudomass</Label>
            </Choice>
            <Choice>
              <Value>Confluent_fibrosis</Value>
              <Label>Probable confluent fibrosis</Label>
            </Choice>
            <Choice>
              <Value>Focal_scar</Value>
              <Label>Probable focal scar</Label>
            </Choice>
            <Choice>
              <Value>Distinct</Value>
              <Label>Distinctive nodule, less than 20 mm, NO major features, NO LR-M features, NO ancillary features favoring malignancy</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>
      
        <ChoiceDataElement Id="arterialEnhancement" IsRequired="true" CdeId="RDE86" DisplaySequence="15">
          <Label>Nonrim arterial phase hyperenhancement</Label>
          <Hint>Enhancement in the arterial phase that is less than that of liver.</Hint>
          <Diagrams>
            <Diagram>
              <Location>aphenorim.PNG</Location>
              <Label>APHE No RIM</Label>
            </Diagram>
            <Diagram>
              <Location>apherim.PNG</Location>
              <Label>APHE RIM</Label>
            </Diagram>
          </Diagrams>

          <VoiceCommand>Arterial phase hyperenhancement APHE</VoiceCommand>
          <ChoiceInfo>
            <Choice>
              <Value>aphe</Value>
              <Label>Yes</Label>
            </Choice>
            <Choice>
              <Value>noaphe</Value>
              <Label>No</Label>
            </Choice>

          </ChoiceInfo>
        </ChoiceDataElement>

        <NumericDataElement Id="diameter" IsRequired="true" CdeId="RDE81" DisplaySequence="16">
          <Label>Observation size (mm)</Label>
          <Hint>Size of the lesion (outer edge to outer edge) in mm</Hint>
          <Minimum>1</Minimum>

        </NumericDataElement>

        <ChoiceDataElement Id="washout" IsRequired="true" CdeId="RDE85" DisplaySequence="17">
          <Label>Nonperipheral "washout"</Label>
          <Hint>Visually assessed temporal reduction in enhancement relative to liver from an
            earlier to a later phase resulting in portal venous phase hypoenhancement or delayed
            phase hypoenhancement.</Hint>
          <Diagrams>
            <Diagram>
              <Location>washout.PNG</Location>
              <Label>Washout</Label>
            </Diagram>
          </Diagrams>
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

        <ChoiceDataElement Id="capsule" IsRequired="true" CdeId="RDE83" DisplaySequence="18">
          <Label>Enhancing "capsule"</Label>
          <Hint>Peripheral rim of smooth hyper-enhancement in the portal venous phase or delayed
            phase that unequivocally is thicker or more conspicuous than the rims surrounding
            background nodule.</Hint>
          <Diagrams>
            <Diagram>
              <Location>capsule.PNG</Location>
              <Label>Capsule</Label>
            </Diagram>
            <Diagram>
              <Location>capsule2.PNG</Location>
              <Label>Capsule Size</Label>
            </Diagram>
          </Diagrams>
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

        <ChoiceDataElement Id="thresholdgrowth" IsRequired="true" CdeId="RDE84" DisplaySequence="19">
          <Label>Threshold growth</Label>
          <Hint>Increase in diameter of a mass compared to its baseline by a minimum of 5 mm AND
            depending on the time interval between examinations, by the following amounts: less
            than or equal to 6 months: >50% diameter increase greater than 6 months: >100%
            diameter increase </Hint>
          <Diagrams>
            <Diagram>
              <Location>tg.PNG</Location>
              <Label>Threshold growth</Label>
            </Diagram>
          </Diagrams>
          <ChoiceInfo>
            <Choice>
              <Value>yes</Value>
              <Label>Yes</Label>
            </Choice>
            <Choice>
              <Value>no</Value>
              <Label>No</Label>
            </Choice>
            <Choice>
              <Value>na</Value>
              <Label>NA</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <ChoiceDataElement Id="sixeincreatein6months" IsRequired="true" DisplaySequence="20">
          <Label>Was there ≥50% size increase in ≤6 months?</Label>
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

        <ChoiceDataElement Id="HistoryofVisibilityonUS" DisplaySequence="21" IsRequired="true">
          <Label>Was the observation visible as a discrete nodule on screening ultrasound?</Label>
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


        <ChoiceDataElement Id="lesionalenhancement" IsRequired="true" DisplaySequence="25">
          <Label>Is there lesional enhancement?</Label>
          <ChoiceInfo>
            <Choice>
              <Value>yes</Value>
              <Label>Yes</Label>
            </Choice>
            <Choice>
              <Value>equivocal</Value>
              <Label>Equivocal</Label>
            </Choice>
            <Choice>
              <Value>no</Value>
              <Label>No</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <ChoiceDataElement Id="enhancementisexpectedpattern" IsRequired="true" DisplaySequence="26">
          <Label>Enhancement in an expected  treatment-specific pattern?</Label>
          <ChoiceInfo>
            <Choice>
              <Value>no</Value>
              <Label>No</Label>
            </Choice>
            <Choice>
              <Value>yes</Value>
              <Label>Yes</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <NumericDataElement Id="sizeoftheenhancementComponents" IsRequired="true" DisplaySequence="27">
          <Label>Size of largest enhancing component (in mm)</Label>
          <Hint>Size of largest enhancing component (in mm)</Hint>
          <Minimum>1</Minimum>

        </NumericDataElement>

        <ChoiceDataElement Id="irregularattheperiphery" IsRequired="true" DisplaySequence="28">
          <Label>Is enhancement nodular OR mass-like OR thick irregular at the periphery?</Label>
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

        <MultiChoiceDataElement Id="patternofenhancement" DisplaySequence="29">
          <Label>Pattern of enhancement</Label>
          <ChoiceInfo>
            <Choice>
              <Value>aphe</Value>
              <Label>Arterial phase hyperenhancement</Label>
            </Choice>
            <Choice>
              <Value>washout</Value>
              <Label>"Washout" (washout appearance)</Label>
            </Choice>
            <Choice>
              <Value>similar_to_pretreatment</Value>
              <Label>Enhancement similar to pretreatment?</Label>
            </Choice>
          </ChoiceInfo>
        </MultiChoiceDataElement>

        <ComputedDataElement Id="patternInEnhancementCE">
          <DecisionPoint>
            <Branch>
              <OrCondition>
                <ContainsCondition DataElementId="patternofenhancement" ComparisonValue="aphe"/>
                <ContainsCondition DataElementId="patternofenhancement" ComparisonValue="washout"/>
                <ContainsCondition DataElementId="patternofenhancement" ComparisonValue="similar_to_pretreatment"/>
              </OrCondition>
              <TextExpression>morethanone</TextExpression>
            </Branch>
            <DefaultBranch>
              <TextExpression>none</TextExpression>
            </DefaultBranch>
          </DecisionPoint>
        </ComputedDataElement>

        <ComputedDataElement Id="washoutcapsulethreshold" >
          <DecisionPoint>
            <Branch>
              <AndCondition>
                <EqualCondition DataElementId="washout" ComparisonValue="no"/>
                <EqualCondition DataElementId="capsule" ComparisonValue="no"/>
                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
              </AndCondition>
              <TextExpression>none</TextExpression>
            </Branch>
            <Branch>
              <OrCondition>
                <AndCondition>
                  <EqualCondition DataElementId="washout" ComparisonValue="yes"/>
                  <EqualCondition DataElementId="capsule" ComparisonValue="no"/>
                  <OrCondition>
                    <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                    <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                  </OrCondition>
                </AndCondition>

                <AndCondition>
                  <EqualCondition DataElementId="washout" ComparisonValue="no"/>
                  <EqualCondition DataElementId="capsule" ComparisonValue="yes"/>
                  <OrCondition>
                    <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                    <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                  </OrCondition>
                </AndCondition>

                <AndCondition>
                  <EqualCondition DataElementId="washout" ComparisonValue="no"/>
                  <EqualCondition DataElementId="capsule" ComparisonValue="no"/>
                  <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="yes"/>
                </AndCondition>
              </OrCondition>
              <TextExpression>one</TextExpression>
            </Branch>
            <DefaultBranch>
              <TextExpression>twoormore</TextExpression>
            </DefaultBranch>
          </DecisionPoint>
        </ComputedDataElement>

        <ChoiceDataElement Id="WhichVein" IsRequired="true" AllowFreetext="true" DisplaySequence="30">
        <Label>What vein or veins?</Label>
        <ChoiceInfo>
          <Choice>
            <Value>Main_portal_vein</Value>
            <Label>Main portal vein</Label>
          </Choice>
          <Choice>
            <Value>Right_portal_vein</Value>
            <Label>Right portal vein</Label>
          </Choice>
          <Choice>
            <Value>Left_portal_vein</Value>
            <Label>Left portal vein</Label>
          </Choice>
          <Choice>
            <Value>Right_hepatic_vein</Value>
            <Label>Right hepatic vein</Label>
          </Choice>
          <Choice>
            <Value>Middle_hepatic_vein</Value>
            <Label>Middle hepatic vein</Label>
          </Choice>
          <Choice>
            <Value>Left_hepatic_vein</Value>
            <Label>Left hepatic vein</Label>
          </Choice>
        </ChoiceInfo>
        </ChoiceDataElement>

        <ChoiceDataElement Id="IsTIVcontiguouswithaparenchymalmass" IsRequired="true" DisplaySequence="31">
        <Label>Is TIV contiguous with a parenchymal mass?</Label>
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

        <ChoiceDataElement Id="Isparenchymalmassinfiltrative" IsRequired="true" DisplaySequence="32">
          <Label>Is parenchymal mass infiltrative</Label>
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

        <ChoiceDataElement Id="Isparenchymalmasstargetoid" IsRequired="true" DisplaySequence="33">
          <Label>Is parenchymal mass targetoid?</Label>
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

        <ChoiceDataElement Id="IsparenchymalmassLR4" IsRequired="true" DisplaySequence="34">
          <Label>Is parenchymal mass LR-4?</Label>
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

        <ChoiceDataElement Id="IsparenchymalmassLR5" IsRequired="true" DisplaySequence="35">
          <Label>Is parenchymal mass LR-5?</Label>
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

        <MultiChoiceDataElement Id="lrmtargetoidmass" IsRequired="true" DisplaySequence="36">
          <Label>Targetoid mass (any of the following)</Label>
          <ChoiceInfo>
            <Choice>
              <Value>Rim_APHE</Value>
              <Label>Rim APHE</Label>
              <Hint>Spatially defined subtype of APHE in which arterial phase enhancement is most pronounced in observation periphery</Hint>
            </Choice>
            <Choice>
              <Value>Peripheral_washout</Value>
              <Label>Peripheral “washout”</Label>
              <Hint>Spatially defined subtype of “washout” in which apparent washout is most pronounced in observation periphery</Hint>
            </Choice>
            <Choice>
              <Value>Delayed_central_enhancement</Value>
              <Label>Delayed central enhancement</Label>
              <Hint>Central area of progressive postarterial phase enhancement</Hint>
            </Choice>
            <Choice>
              <Value>Targetoid_on_DWI</Value>
              <Label>Targetoid on DWI</Label>
            </Choice>
            <Choice>
              <Value>Targetoid_on_transitional_phase/hepatobiliary_phase</Value>
              <Label>Targetoid on transitional phase/hepatobiliary phase</Label>
            </Choice>
            <Choice>
              <Value>Not_evaluated</Value>
              <Label>NA</Label>
            </Choice>
          </ChoiceInfo>
        </MultiChoiceDataElement>

        <MultiChoiceDataElement Id="lrmnontargetoidmass" IsRequired="true" DisplaySequence="37">
          <Label>Nontargetoid mass (NOT LR-5 and no TIV)</Label>
          <ChoiceInfo>
            <Choice>
              <Value>Infiltrative_appearance</Value>
              <Label>Infiltrative appearance</Label>
            </Choice>
            <Choice>
              <Value>Marked_diffusion_restriction</Value>
              <Label>Marked diffusion restriction</Label>
            </Choice>
            <Choice>
              <Value>Necrosis_or_severe_ischemia</Value>
              <Label>Necrosis or severe ischemia</Label>
            </Choice>
            <Choice>
              <Value>Othery</Value>
              <Label>Other feature that in radiologist’s judgment suggests non-HCC malignancy(specify in report)</Label>
            </Choice>
            <Choice>
              <Value>Not_evaluated</Value>
              <Label>NA</Label>
            </Choice>
          </ChoiceInfo>
        </MultiChoiceDataElement>

        <ChoiceDataElement Id="adjustcategorybasedonAncillary" DisplaySequence="38">
          <Label>Do you want to adjust category based on ancillary features? </Label>
          <Diagrams>
            <Diagram>
              <Location>af.PNG</Location>
              <Label/>
            </Diagram>
          </Diagrams>
          <ChoiceInfo>
            <Choice IsDefault="true">
              <Value>No</Value>
              <Label>No</Label>
            </Choice>
            <Choice>
              <Value>Upgradetohcc2</Value>
              <Label>Upgrade to LR-2</Label>
            </Choice>
            <Choice>
              <Value>Upgradetohcc3</Value>
              <Label>Upgrade to LR-3</Label>
            </Choice>
            <Choice>
              <Value>Upgradetohcc4</Value>
              <Label>Upgrade to LR-4</Label>
            </Choice>
            <Choice>
              <Value>Downgradetohcc4</Value>
              <Label>Downgrade to LR-4</Label>
            </Choice>
            <Choice>
              <Value>Downgradetohcc3</Value>
              <Label>Downgrade to LR-3</Label>
            </Choice>
            <Choice>
              <Value>Downgradetohcc2</Value>
              <Label>Downgrade to LR-2</Label>
            </Choice>
            <Choice>
              <Value>Downgradetohcc1</Value>
              <Label>Downgrade to LR-1</Label>
            </Choice>
          </ChoiceInfo>
        </ChoiceDataElement>

        <MultiChoiceDataElement Id="ancillaryFavoringMalignancy" DisplaySequence="39">
          <Label>Are there ancillary features favoring malignancy? </Label>
          <Diagrams>
            <Diagram>
              <Location>af.PNG</Location>
              <Label/>
            </Diagram>
          </Diagrams>
          <ChoiceInfo>
            <Choice>
              <Value>US_visibility_as_discrete_nodule</Value>
              <Label>US visibility as discrete nodule</Label>
              <Hint>Unenhanced US visibility as discrete nodule or mass corresponding to CT- or MRI-detected observation</Hint>
              <ReportText>US visibility as discrete nodule</ReportText>
            </Choice>
            <Choice>
              <Value>Subthreshold_growth</Value>
              <Label>Subthreshold growth</Label>
              <Hint>Unequivocal size increase of a mass, less than threshold growth.</Hint>
              <ReportText>Subthreshold growth</ReportText>
            </Choice>
            <Choice>
              <Value>Corona_enhancement</Value>
              <Label>Corona enhancement</Label>
              <Hint>Periobservational enhancement in late arterial phase or early PVP attributable to venous drainage from tumor</Hint>
              <ReportText>Corona enhancement</ReportText>
            </Choice>
            <Choice>
              <Value>Fat_sparing_in_solid_massFat sparing in solid mass</Value>
              <Label>Fat sparing in solid mass</Label>
              <Hint>Relative paucity of fat in solid mass relative to steatotic liver OR in inner nodule relative to steatotic outer nodule</Hint>
              <ReportText>Fat sparing in solid mass</ReportText>
            </Choice>
            <Choice>
              <Value>Restricted_diffusion</Value>
              <Label>Restricted diffusion</Label>
              <Hint>Intensity on DWI, not attributable solely to T2 shine-through, unequivocally higher than liver and/or ADC unequivocally lower than liver</Hint>
              <ReportText>Restricted diffusion</ReportText>
            </Choice>
            <Choice>
              <Value>Mild-moderate_T2_hyperintensity</Value>
              <Label>Mild-moderate T2 hyperintensity</Label>
              <Hint>Intensity on T2WI mildly or moderately higher than liver and similar to or less than non-iron-overloaded spleen</Hint>
              <ReportText>Mild-moderate T2 hyperintensity</ReportText>
            </Choice>
            <Choice>
              <Value>Iron_sparing_in_solid_mass</Value>
              <Label>Iron sparing in solid mass</Label>
              <Hint>Paucity of iron in solid mass relative to iron-overloaded liver OR in inner nodule relative to siderotic outer nodule</Hint>
              <ReportText>Iron sparing in solid mass</ReportText>
            </Choice>
            <Choice>
              <Value>Transitional_phase_hypointensity</Value>
              <Label>Transitional phase hypointensity</Label>
              <Hint>Intensity in the transitional phase unequivocally less, in whole or in part, than liver</Hint>
              <ReportText>Transitional phase hypointensity</ReportText>
            </Choice>
            <Choice>
              <Value>Hepatobiliary_phase_hypointensity</Value>
              <Label>Hepatobiliary phase hypointensity</Label>
              <Hint>Intensity in the hepatobiliary phase unequivocally less, in whole or in part, than liver</Hint>
              <ReportText>Hepatobiliary phase hypointensity</ReportText>
            </Choice>
            <Choice>
              <Value>Nonenhancing_capsule</Value>
              <Label>Nonenhancing “capsule”</Label>
              <Hint>Capsule appearance not visible as an enhancing rim</Hint>
              <ReportText>Nonenhancing “capsule”</ReportText>
            </Choice>
            <Choice>
              <Value>Nodule-in-nodule_architecture</Value>
              <Label>Nodule-in-nodule architecture</Label>
              <Hint>Presence of smaller inner nodule within and having different imaging features than larger outer nodule</Hint>
              <ReportText>Nodule-in-nodule architecture</ReportText>
            </Choice>
            <Choice>
              <Value>Mosaic_architecture</Value>
              <Label>Mosaic architecture</Label>
              <Hint>Presence of randomly distributed internal nodules or compartments, usually with different imaging features</Hint>
              <ReportText>Mosaic architecture</ReportText>
            </Choice>
            <Choice>
              <Value>Fat_in_mass_more_than_adjacent_liver</Value>
              <Label>Fat in mass, more than adjacent liver</Label>
              <Hint>Excess fat within a mass, in whole or in part, relative to adjacent liver</Hint>
              <ReportText>Fat in mass, more than adjacent liver</ReportText>
            </Choice>
            <Choice>
              <Value>Blood_products_in_mass</Value>
              <Label>Blood products in mass</Label>
              <Hint>Intralesional or perilesional hemorrhage in the absence of biopsy, trauma or intervention</Hint>
              <ReportText>Blood products in mass</ReportText>
            </Choice>
          </ChoiceInfo>
        </MultiChoiceDataElement>

        <MultiChoiceDataElement Id="ancillaryFavoringBenignity" DisplaySequence="40">
          <Label>Are there ancillary features favoring benignity?</Label>
          <Hint></Hint>
          <ChoiceInfo>
            <Choice>
              <Value>Size_stability_≥_2_years</Value>
              <Label>Size stability ≥ 2 years</Label>
              <Hint>No significant change in observation size measured on exams ≥ 2 years apart in absence of treatment</Hint>
              <ReportText>Size stability ≥ 2 years</ReportText>
            </Choice>
            <Choice>
              <Value>Size_reduction</Value>
              <Label>Size reduction</Label>
              <Hint>Unequivocal spontaneous decrease in size over time, not attributable to artifact, measurement error, technique differences, or resorption of blood products</Hint>
              <ReportText>Size reduction</ReportText>
            </Choice>
            <Choice>
              <Value>Parallels_blood_pool_enhancement</Value>
              <Label>Parallels blood pool enhancement</Label>
              <Hint>Temporal pattern in which enhancement eventually reaches and then matches that of blood pool</Hint>
              <ReportText>Parallels blood pool enhancement</ReportText>
            </Choice>
            <Choice>
              <Value>Undistorted_vessels</Value>
              <Label>Undistorted vessels</Label>
              <Hint>Vessels traversing an observation without displacement, deformation, or other alteration</Hint>
              <ReportText>Undistorted vessels</ReportText>
            </Choice>
            <Choice>
              <Value>Iron_in_mass_more_than_liver</Value>
              <Label>Iron in mass, more than liver</Label>
              <Hint>Excess iron in a mass relative to background liver</Hint>
              <ReportText>Iron in mass, more than liver</ReportText>
            </Choice>
            <Choice>
              <Value>Marked_T2_hyperintensity</Value>
              <Label>Marked T2 hyperintensity</Label>
              <Hint>Intensity on T2WI markedly higher than liver and similar to bile ducts and other fluid-filled structures</Hint>
              <ReportText>Marked T2 hyperintensity</ReportText>
            </Choice>
            <Choice>
              <Value>Hepatobiliary_phase_isointensity</Value>
              <Label>Hepatobiliary phase isointensity</Label>
              <Hint>Intensity in hepatobiliary phase nearly identical to liver</Hint>
              <ReportText>Hepatobiliary phase isointensity</ReportText>
            </Choice>
          </ChoiceInfo>
        </MultiChoiceDataElement>

      </DataElements>

      <Rules>
        <DecisionPoint Id="observationinpatientDp">
          <Label>Observation in high-risk patient</Label>
          <Branch>
            <Label>Treated observation</Label>
            <NotRelevantDataElements>
              <DataElementRef DataElementId="untreatedobservation"/>
              <DataElementRef DataElementId="LR1Features"/>
              <DataElementRef DataElementId="LR2features"/>
              <DataElementRef DataElementId="arterialEnhancement"/>
              <DataElementRef DataElementId="diameter"/>
              <DataElementRef DataElementId="washout"/>
              <DataElementRef DataElementId="capsule"/>
              <DataElementRef DataElementId="thresholdgrowth"/>
              <DataElementRef DataElementId="ancillaryFavoringMalignancy"/>
              <DataElementRef DataElementId="ancillaryFavoringBenignity"/>
              <DataElementRef DataElementId="adjustcategorybasedonAncillary"/>
              <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
              <DataElementRef DataElementId="sixeincreatein6months"/>
              <DataElementRef DataElementId="IsTIVcontiguouswithaparenchymalmass"/>
              <DataElementRef DataElementId="WhichVein"/>
              <DataElementRef DataElementId="Isparenchymalmassinfiltrative"/>
              <DataElementRef DataElementId="Isparenchymalmasstargetoid"/>
              <DataElementRef DataElementId="IsparenchymalmassLR4"/>
              <DataElementRef DataElementId="IsparenchymalmassLR5"/>
              <DataElementRef DataElementId="lrmtargetoidmass"/>
              <DataElementRef DataElementId="lrmnontargetoidmass"/>
            </NotRelevantDataElements>

            <EqualCondition DataElementId="observationinPatient" ComparisonValue="treated"/>

            <DecisionPoint Id="treatedObservationDp">
              <Label>Treated observation features</Label>
              <Branch>
                <Label>If treatment response cannot be evaluated due image degradation or omission</Label>
                <NotRelevantDataElements>
                  <DataElementRef DataElementId="lesionalenhancement"/>
                  <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                  <DataElementRef DataElementId="irregularattheperiphery"/>
                  <DataElementRef DataElementId="patternofenhancement"/>
                  <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                </NotRelevantDataElements>
                <EqualCondition DataElementId="treatedobservation"
                  ComparisonValue="LRTRNonevaluable"/>
                <EndPointRef EndPointId="LRTRNonevaluable"/>
              </Branch>
              <Branch>
                <Label>Otherwise</Label>
                <EqualCondition DataElementId="treatedobservation" ComparisonValue="otherwise"/>
                <DecisionPoint Id="lesionalenhancementDp">
                  <Label>Is there lesional enhancement?</Label>
                  <Branch>
                    <Label>Yes</Label>
                    <EqualCondition DataElementId="lesionalenhancement" ComparisonValue="yes"/>
                    <DecisionPoint Id="enhancementspecificpatternDp">
                      <Label>Enhancement in an expected  treatment-specific pattern?</Label>
                      <Branch>
                        <Label>Yes</Label>
                        <NotRelevantDataElements>
                          <DataElementRef DataElementId="irregularattheperiphery"/>
                          <DataElementRef DataElementId="patternofenhancement"/>
                          <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                        </NotRelevantDataElements>
                        <EqualCondition DataElementId="enhancementisexpectedpattern" ComparisonValue="yes"/>
                        <EndPointRef EndPointId="LRTRNonviable"></EndPointRef>
                      </Branch>
                      <Branch>
                        <Label>No</Label>
                        <EqualCondition DataElementId="enhancementisexpectedpattern" ComparisonValue="no"/>
                        <DecisionPoint Id="noenhancementisexpectedpatternDp">
                          <Label>Is enhancement nodular OR mass-like OR thick irregular at the periphery?</Label>
                          <Branch>
                            <Label>No</Label>
                            <NotRelevantDataElements>
                              <DataElementRef DataElementId="patternofenhancement"/>
                            </NotRelevantDataElements>
                            <EqualCondition DataElementId="irregularattheperiphery" ComparisonValue="no"/>
                            <EndPointRef EndPointId="LRTREquivoca"></EndPointRef>
                          </Branch>
                          <Branch>
                            <Label>Yes</Label>
                            <EqualCondition DataElementId="irregularattheperiphery" ComparisonValue="yes"/>
                            <DecisionPoint Id="patterenenhancementdp">
                              <Label>Pattern of enhancement</Label>
                              <Branch>
                                <Label>None</Label>
                                <EqualCondition DataElementId="patternInEnhancementCE" ComparisonValue="none"/>
                                <EndPointRef EndPointId="LRTREquivoca"></EndPointRef>
                              </Branch>
                              <Branch>
                                <Label>At least one pattern of enhancement</Label>
                                <EqualCondition DataElementId="patternInEnhancementCE" ComparisonValue="morethanone"/>
                                <EndPointRef EndPointId="LRTRViable"></EndPointRef>
                              </Branch>
                            </DecisionPoint>
                          </Branch>
                        </DecisionPoint>
                      </Branch>
                    </DecisionPoint>
                  </Branch>
                  <Branch>
                    <Label>No</Label>
                    <NotRelevantDataElements>
                      <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                      <DataElementRef DataElementId="irregularattheperiphery"/>
                      <DataElementRef DataElementId="patternofenhancement"/>
                      <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                    </NotRelevantDataElements>
                    <EqualCondition DataElementId="lesionalenhancement" ComparisonValue="no"/>
                    <EndPointRef EndPointId="LRTRNonviable"></EndPointRef>
                  </Branch>
                  <Branch>
                    <Label>Equivocal</Label>
                    <NotRelevantDataElements>
                      <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                      <DataElementRef DataElementId="irregularattheperiphery"/>
                      <DataElementRef DataElementId="patternofenhancement"/>
                    </NotRelevantDataElements>
                    <EqualCondition DataElementId="lesionalenhancement" ComparisonValue="equivocal"/>
                    <EndPointRef EndPointId="LRTREquivoca"></EndPointRef>
                  </Branch>
                </DecisionPoint>
              </Branch>
            </DecisionPoint>
          </Branch>
          <Branch>
            <Label>Untreated observation</Label>
            <NotRelevantDataElements>
              <DataElementRef DataElementId="treatedobservation"/>
              <DataElementRef DataElementId="pretreatmentsize"/>
              <DataElementRef DataElementId="pretreatmentCategory"/>
              <DataElementRef DataElementId="TreatmentMethod"/>
            </NotRelevantDataElements>

            <EqualCondition DataElementId="observationinPatient" ComparisonValue="untreated"/>

            <DecisionPoint Id="untreatedObservationDp">
              <Label> Untreated observation without pathologic proof in patient at high-risk
                for HCC </Label>
              <Branch>
                <Label>Cannot be categorized due to image degradation or omission</Label>
                <NotRelevantDataElements>
                  <DataElementRef DataElementId="LR1Features"/>
                  <DataElementRef DataElementId="LR2features"/>
                  <DataElementRef DataElementId="arterialEnhancement"/>
                  <DataElementRef DataElementId="diameter"/>
                  <DataElementRef DataElementId="washout"/>
                  <DataElementRef DataElementId="capsule"/>
                  <DataElementRef DataElementId="thresholdgrowth"/>
                  <DataElementRef DataElementId="lesionalenhancement"/>
                  <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                  <DataElementRef DataElementId="irregularattheperiphery"/>
                  <DataElementRef DataElementId="patternofenhancement"/>
                  <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                  <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                  <DataElementRef DataElementId="sixeincreatein6months"/>
                  <DataElementRef DataElementId="IsTIVcontiguouswithaparenchymalmass"/>
                  <DataElementRef DataElementId="WhichVein"/>
                  <DataElementRef DataElementId="Isparenchymalmassinfiltrative"/>
                  <DataElementRef DataElementId="Isparenchymalmasstargetoid"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR4"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                  <DataElementRef DataElementId="lrmtargetoidmass"/>
                  <DataElementRef DataElementId="lrmnontargetoidmass"/>
                </NotRelevantDataElements>
                <EqualCondition DataElementId="untreatedobservation"
                  ComparisonValue="notcategorized"/>
                <EndPointRef EndPointId="LRNC"/>
              </Branch>

              <Branch>
                <Label>Tumor in vein</Label>
                <NotRelevantDataElements>
                  <DataElementRef DataElementId="LR1Features"/>
                  <DataElementRef DataElementId="LR2features"/>
                  <DataElementRef DataElementId="arterialEnhancement"/>
                  <DataElementRef DataElementId="diameter"/>
                  <DataElementRef DataElementId="washout"/>
                  <DataElementRef DataElementId="capsule"/>
                  <DataElementRef DataElementId="thresholdgrowth"/>
                  <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                  <DataElementRef DataElementId="irregularattheperiphery"/>
                  <DataElementRef DataElementId="patternofenhancement"/>
                  <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                  <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                  <DataElementRef DataElementId="sixeincreatein6months"/>
                  <DataElementRef DataElementId="lesionalenhancement"/>
                  <DataElementRef DataElementId="lrmtargetoidmass"/>
                  <DataElementRef DataElementId="lrmnontargetoidmass"/>
                </NotRelevantDataElements>
                <EqualCondition DataElementId="untreatedobservation"
                  ComparisonValue="tumorInVein"/>

                  <DecisionPoint Id="istheretumorinveinDp">
                    <Label>Is TIV contiguous with a parenchymal mass?</Label>
                    <Branch>
                        <Label>Yes</Label>
                        <EqualCondition DataElementId="IsTIVcontiguouswithaparenchymalmass" ComparisonValue="yes"/>
                        <DecisionPoint Id="IsparenchymalmassinfiltrativeDp">
                          <Label>Is parenchymal mass infiltrative?</Label>
                          <Branch>
                            <Label>Yes</Label>
                            <NotRelevantDataElements>
                              <DataElementRef DataElementId="Isparenchymalmasstargetoid"/>
                              <DataElementRef DataElementId="IsparenchymalmassLR4"/>
                              <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                            </NotRelevantDataElements>
                            <EqualCondition DataElementId="Isparenchymalmassinfiltrative" ComparisonValue="yes"/>
                            <EndPointRef EndPointId="LRTIV_proabably_hcc"></EndPointRef>
                          </Branch>
                          <Branch>
                            <Label>No</Label>
                            <EqualCondition DataElementId="Isparenchymalmassinfiltrative" ComparisonValue="no"/>
                            <DecisionPoint Id="IsparenchymalmasstargetoidDp">
                              <Label>Is parenchymal mass targetoid?</Label>
                              <Branch>
                                <Label>Yes</Label>
                                <NotRelevantDataElements>
                                  <DataElementRef DataElementId="IsparenchymalmassLR4"/>
                                  <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                                </NotRelevantDataElements>
                                <EqualCondition DataElementId="Isparenchymalmasstargetoid" ComparisonValue="yes"/>
                                <EndPointRef EndPointId="LRTIV_non_hcc"></EndPointRef>
                              </Branch>
                              <Branch>
                                <Label>No</Label>
                                <EqualCondition DataElementId="Isparenchymalmasstargetoid" ComparisonValue="no"/>
                                <DecisionPoint Id="IsparenchymalmassLR4Dp">
                                  <Label>Is parenchymal mass LR-4?</Label>
                                  <Branch>
                                    <Label>Yes</Label>
                                    <NotRelevantDataElements>
                                      <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                                    </NotRelevantDataElements>
                                    <EqualCondition DataElementId="IsparenchymalmassLR4" ComparisonValue="yes"/>
                                    <EndPointRef EndPointId="LRTIV_proabably_hcc"></EndPointRef>
                                  </Branch>
                                  <Branch>
                                    <Label>No</Label>
                                    <EqualCondition DataElementId="IsparenchymalmassLR4" ComparisonValue="no"/>
                                    <DecisionPoint Id="IsparenchymalmassLR5Dp">
                                      <Label>Is parenchymal mass LR-5?</Label>
                                      <Branch>
                                        <Label>Yes</Label>
                                        <EqualCondition DataElementId="IsparenchymalmassLR5" ComparisonValue="yes"/>
                                        <EndPointRef EndPointId="LRTIV_def_hcc"></EndPointRef>
                                      </Branch>
                                      <Branch>
                                        <Label>No</Label>
                                        <EqualCondition DataElementId="IsparenchymalmassLR5" ComparisonValue="no"/>
                                        <EndPointRef EndPointId="LRTIV_Etiology_uncertain"></EndPointRef>
                                      </Branch>
                                    </DecisionPoint>
                                  </Branch>
                                </DecisionPoint>
                              </Branch>
                            </DecisionPoint>
                          </Branch>
                        </DecisionPoint>
                      </Branch>
                    <Branch>
                      <Label>No</Label>
                      <NotRelevantDataElements>
                        <DataElementRef DataElementId="Isparenchymalmassinfiltrative"/>
                        <DataElementRef DataElementId="Isparenchymalmasstargetoid"/>
                        <DataElementRef DataElementId="IsparenchymalmassLR4"/>
                        <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                      </NotRelevantDataElements>
                      <EqualCondition DataElementId="IsTIVcontiguouswithaparenchymalmass" ComparisonValue="no"/>
                      <EndPointRef EndPointId="LRTIV_Etiology_uncertain"></EndPointRef>
                    </Branch>
                  </DecisionPoint>


              </Branch>

              <Branch>
                <Label>Definitely benign</Label>
                <NotRelevantDataElements>
                  <DataElementRef DataElementId="LR2features"/>
                  <DataElementRef DataElementId="arterialEnhancement"/>
                  <DataElementRef DataElementId="diameter"/>
                  <DataElementRef DataElementId="washout"/>
                  <DataElementRef DataElementId="capsule"/>
                  <DataElementRef DataElementId="thresholdgrowth"/>
                  <DataElementRef DataElementId="lesionalenhancement"/>
                  <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                  <DataElementRef DataElementId="irregularattheperiphery"/>
                  <DataElementRef DataElementId="patternofenhancement"/>
                  <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                  <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                  <DataElementRef DataElementId="sixeincreatein6months"/>
                  <DataElementRef DataElementId="IsTIVcontiguouswithaparenchymalmass"/>
                  <DataElementRef DataElementId="WhichVein"/>
                  <DataElementRef DataElementId="Isparenchymalmassinfiltrative"/>
                  <DataElementRef DataElementId="Isparenchymalmasstargetoid"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR4"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                  <DataElementRef DataElementId="lrmtargetoidmass"/>
                  <DataElementRef DataElementId="lrmnontargetoidmass"/>
                </NotRelevantDataElements>
                <EqualCondition DataElementId="untreatedobservation"
                  ComparisonValue="definitelyBenign"/>
                <EndPointRef EndPointId="LR1"/>
              </Branch>

              <Branch>
                <Label>Probably benign</Label>
                <NotRelevantDataElements>
                  <DataElementRef DataElementId="LR1Features"/>
                  <DataElementRef DataElementId="arterialEnhancement"/>
                  <DataElementRef DataElementId="diameter"/>
                  <DataElementRef DataElementId="washout"/>
                  <DataElementRef DataElementId="capsule"/>
                  <DataElementRef DataElementId="thresholdgrowth"/>
                  <DataElementRef DataElementId="lesionalenhancement"/>
                  <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                  <DataElementRef DataElementId="irregularattheperiphery"/>
                  <DataElementRef DataElementId="patternofenhancement"/>
                  <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                  <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                  <DataElementRef DataElementId="sixeincreatein6months"/>
                  <DataElementRef DataElementId="IsTIVcontiguouswithaparenchymalmass"/>
                  <DataElementRef DataElementId="WhichVein"/>
                  <DataElementRef DataElementId="Isparenchymalmassinfiltrative"/>
                  <DataElementRef DataElementId="Isparenchymalmasstargetoid"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR4"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                  <DataElementRef DataElementId="lrmtargetoidmass"/>
                  <DataElementRef DataElementId="lrmnontargetoidmass"/>
                </NotRelevantDataElements>
                <EqualCondition DataElementId="untreatedobservation"
                  ComparisonValue="probablyBenign"/>
                <EndPointRef EndPointId="LR2"/>
              </Branch>

              <Branch>
                <Label>Probably or definitely malignant but not HCC specific </Label>
                <NotRelevantDataElements>
                  <DataElementRef DataElementId="LR1Features"/>
                  <DataElementRef DataElementId="LR2features"/>
                  <DataElementRef DataElementId="arterialEnhancement"/>
                  <DataElementRef DataElementId="washout"/>
                  <DataElementRef DataElementId="capsule"/>
                  <DataElementRef DataElementId="thresholdgrowth"/>
                  <DataElementRef DataElementId="lesionalenhancement"/>
                  <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                  <DataElementRef DataElementId="irregularattheperiphery"/>
                  <DataElementRef DataElementId="patternofenhancement"/>
                  <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                  <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                  <DataElementRef DataElementId="sixeincreatein6months"/>
                  <DataElementRef DataElementId="IsTIVcontiguouswithaparenchymalmass"/>
                  <DataElementRef DataElementId="WhichVein"/>
                  <DataElementRef DataElementId="Isparenchymalmassinfiltrative"/>
                  <DataElementRef DataElementId="Isparenchymalmasstargetoid"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR4"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                </NotRelevantDataElements>
                <EqualCondition DataElementId="untreatedobservation"
                  ComparisonValue="malignantbutnothcc"/>
                <EndPointRef EndPointId="LRM"/>
              </Branch>

              <Branch>
                <Label>Otherwise</Label>
                <NotRelevantDataElements>
                  <DataElementRef DataElementId="LR1Features"/>
                  <DataElementRef DataElementId="LR2features"/>
                  <DataElementRef DataElementId="lesionalenhancement"/>
                  <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                  <DataElementRef DataElementId="irregularattheperiphery"/>
                  <DataElementRef DataElementId="patternofenhancement"/>
                  <DataElementRef DataElementId="sizeoftheenhancementComponents"/>
                  <DataElementRef DataElementId="enhancementisexpectedpattern"/>
                  <DataElementRef DataElementId="IsTIVcontiguouswithaparenchymalmass"/>
                  <DataElementRef DataElementId="WhichVein"/>
                  <DataElementRef DataElementId="Isparenchymalmassinfiltrative"/>
                  <DataElementRef DataElementId="Isparenchymalmasstargetoid"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR4"/>
                  <DataElementRef DataElementId="IsparenchymalmassLR5"/>
                  <DataElementRef DataElementId="lrmtargetoidmass"/>
                  <DataElementRef DataElementId="lrmnontargetoidmass"/>
                </NotRelevantDataElements>

                <EqualCondition DataElementId="untreatedobservation" ComparisonValue="nonofabove"/>

                <DecisionPoint Id="ArterialphaseDp">
                  <Label>Nonrim arterial phase hyperenhancement</Label>
                  <Branch>
                    <Label>APHE</Label>
                    <!-- NO APHE -->
                    <AndCondition>
                    <EqualCondition DataElementId="arterialEnhancement" ComparisonValue="aphe"/>
                    <EqualCondition DataElementId="adjustcategorybasedonAncillary" ComparisonValue="No"/>
                    </AndCondition>

                    <DecisionPoint Id="diameterDp">
                      <Label>Observation size (mm)</Label>
                      <Branch>
                        <Label>&lt; 10</Label>
                        <NotRelevantDataElements>
                          <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                          <DataElementRef DataElementId="sixeincreatein6months"/>
                        </NotRelevantDataElements>
                        <!-- Diameter < 10 -->
                        <LessThanCondition DataElementId="diameter"
                          ComparisonValue="diameterSmall"/>
                        <DecisionPoint Id="wasoutCapsultThreDp1">
                          <Label>Washout/Capsule/Thresholdgrowth</Label>
                          <Branch>
                            <Label>None</Label>
                            <!-- None / Zero Y's -->
                            <AndCondition>
                            <EqualCondition DataElementId="washout"	ComparisonValue="no"/>
                            <EqualCondition DataElementId="capsule"	ComparisonValue="no"/>
                            <OrCondition>
                              <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                              <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                            </OrCondition>
                            </AndCondition>
                            <EndPointRef EndPointId="LR3"/>
                          </Branch>
                          <Branch>
                            <Label>One </Label>
                            <!-- One / One Y -->
                            <OrCondition>
                              <AndCondition>
                                <EqualCondition DataElementId="washout"	ComparisonValue="yes"/>
                                <!-- Washout = Yes -->
                                <EqualCondition DataElementId="capsule"	ComparisonValue="no"/>
                                  <OrCondition>
                                    <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                    <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                                  </OrCondition>
                              </AndCondition>
                              <AndCondition>
                                <EqualCondition DataElementId="washout"
                                ComparisonValue="no"/>
                                <!-- Capsule = Yes -->
                                <EqualCondition DataElementId="capsule"
                                ComparisonValue="yes"/>
                                  <OrCondition>
                                    <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                    <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                                  </OrCondition>
                              </AndCondition>
                              <AndCondition>
                                <EqualCondition DataElementId="washout"
                                ComparisonValue="no"/>
                                <!-- Thresholdgrowth = Yes -->
                                <EqualCondition DataElementId="capsule"
                                ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth"
                                ComparisonValue="yes"/>
                              </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR4"/>
                          </Branch>
                          <Branch>
                            <Label>Two or More</Label>
                            <!-- Two / Two or more Y's -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR4"/>
                          </Branch>
                        </DecisionPoint>
                      </Branch>
                      <Branch>
                        <Label>10-19</Label>
                        <!-- 10 <= Diameter <= 19 -->
                        <AndCondition>
                          <GreaterThanOrEqualsCondition DataElementId="diameter"
                            ComparisonValue="diameterSmall"/>
                          <LessThanOrEqualsCondition DataElementId="diameter"
                            ComparisonValue="19"/>
                        </AndCondition>
                        <DecisionPoint Id="wasoutCapsultThreDp2">
                          <Label>Washout/Capsule/Thresholdgrowth</Label>
                          <Branch>
                            <Label>None</Label>
                            <NotRelevantDataElements>
                              <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                              <DataElementRef DataElementId="sixeincreatein6months"/>
                            </NotRelevantDataElements>
                            <!-- None / Zero Y's -->
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <EndPointRef EndPointId="LR3"/>
                          </Branch>
                          <Branch>
                            <Label>One</Label>
                            <!-- One / One Y -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>

                            <DecisionPoint Id="lr4_5deciderDp">
                              <Label>APHE Present?</Label>
                              <Branch>
                                <Label>Yes</Label>
                                <EqualCondition DataElementId="arterialEnhancement" ComparisonValue="aphe"/>
                                <DecisionPoint Id="aphefeatures">
                                  <Label>washout / capsule / thresholdgrowth</Label>
                                  <Branch>
                                    <Label>More than two</Label>
                                    <EqualCondition DataElementId="washoutcapsulethreshold" ComparisonValue="twoormore"/>
                                    <EndPointRef EndPointId="LR5"></EndPointRef>
                                  </Branch>
                                  <Branch>
                                    <Label> Only 1 Major features present</Label>
                                    <EqualCondition DataElementId="washoutcapsulethreshold" ComparisonValue="one"/>
                                    <DecisionPoint Id="OnemajorfeaturepresentDp">
                                      <Label>Which feature present?</Label>
                                      <Branch>
                                        <Label>Washout</Label>
                                        <NotRelevantDataElements>
                                          <DataElementRef DataElementId="sixeincreatein6months"></DataElementRef>
                                        </NotRelevantDataElements>
                                        <EqualCondition DataElementId="washout" ComparisonValue="yes"/>
                                        <DecisionPoint Id="historyofvisibilityDp">
                                          <Label>Was the observation visible as a discrete nodule on screening ultrasound?</Label>
                                          <Branch>
                                            <Label>Yes</Label>
                                            <EqualCondition DataElementId="HistoryofVisibilityonUS" ComparisonValue="yes"/>
                                            <EndPointRef EndPointId="LR5us"></EndPointRef>
                                          </Branch>
                                          <Branch>
                                            <Label>No</Label>
                                            <EqualCondition DataElementId="HistoryofVisibilityonUS" ComparisonValue="no"/>
                                            <EndPointRef EndPointId="LR4"></EndPointRef>
                                          </Branch>
                                        </DecisionPoint>
                                      </Branch>
                                      <Branch>
                                        <Label>Thresholdgrowth present</Label>
                                        <NotRelevantDataElements>
                                          <DataElementRef DataElementId="HistoryofVisibilityonUS"></DataElementRef>
                                        </NotRelevantDataElements>
                                        <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="yes"/>
                                        <DecisionPoint Id="thresholdgrowthDp">
                                          <Label>Was there ≥50% size increase in ≤6 months?</Label>
                                          <Branch>
                                            <Label>Yes</Label>
                                            <EqualCondition DataElementId="sixeincreatein6months" ComparisonValue="yes"/>
                                            <EndPointRef EndPointId="LR5g"></EndPointRef>
                                          </Branch>
                                          <Branch>
                                            <Label>No</Label>
                                            <EqualCondition DataElementId="sixeincreatein6months" ComparisonValue="no"/>
                                            <EndPointRef EndPointId="LR4"></EndPointRef>
                                          </Branch>
                                        </DecisionPoint>
                                      </Branch>

                                      <Branch>
                                        <Label>Capsule present</Label>
                                        <NotRelevantDataElements>
                                          <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                                          <DataElementRef DataElementId="sixeincreatein6months"/>
                                        </NotRelevantDataElements>
                                        <EqualCondition DataElementId="capsule" ComparisonValue="yes"/>
                                        <EndPointRef EndPointId="LR4"></EndPointRef>
                                      </Branch>
                                    </DecisionPoint>
                                  </Branch>
                                </DecisionPoint>
                              </Branch>
                            </DecisionPoint>

                          </Branch>
                          <Branch>
                            <Label>Two or More</Label>
                            <NotRelevantDataElements>
                              <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                              <DataElementRef DataElementId="sixeincreatein6months"/>
                            </NotRelevantDataElements>
                            <!-- Two / Two or more Y's -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR5"/>
                          </Branch>
                        </DecisionPoint>
                      </Branch>
                      <Branch>
                        <Label>&gt;= 20</Label>
                        <NotRelevantDataElements>
                          <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                          <DataElementRef DataElementId="sixeincreatein6months"/>
                        </NotRelevantDataElements>
                        <!-- Diameter >= 20 -->
                        <GreaterThanOrEqualsCondition DataElementId="diameter"
                          ComparisonValue="diameterLarge"/>
                        <DecisionPoint Id="wasoutCapsultThreDp3">
                          <Label>Washout/Capsule/Thresholdgrowth</Label>
                          <Branch>
                            <Label>None</Label>
                            <!-- None / Zero Y's -->
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <EndPointRef EndPointId="LR4"/>
                          </Branch>
                          <Branch>
                            <Label>One</Label>
                            <!-- One / One Y -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR5"/>
                          </Branch>
                          <Branch>
                            <Label>Two or More</Label>
                            <!-- Two / Two or more Y's -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR5"/>
                          </Branch>
                        </DecisionPoint>
                      </Branch>
                    </DecisionPoint>
                  </Branch>
                  <Branch>
                    <Label>NO APHE</Label>
                    <NotRelevantDataElements>
                      <DataElementRef DataElementId="sixeincreatein6months"/>
                      <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                    </NotRelevantDataElements>
                    <!-- Hypo/Iso-enhancement -->
                    <AndCondition>
                      <EqualCondition DataElementId="arterialEnhancement"	ComparisonValue="noaphe"/>
                      <EqualCondition DataElementId="adjustcategorybasedonAncillary" ComparisonValue="No"/>
                    </AndCondition>

                    <DecisionPoint Id="DiameterDp2">
                      <Label>Observation size (mm)</Label>
                      <Branch>
                        <Label>&lt; 20</Label>
                        <!-- Diameter < 20 -->
                        <LessThanCondition DataElementId="diameter"
                          ComparisonValue="diameterLarge"/>
                        <DecisionPoint Id="wasoutCapsultThreDp4">
                          <Label>Washout/Capsule/Thresholdgrowth</Label>
                          <Branch>
                            <Label>None</Label>
                            <!-- None / Zero Y's -->
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <EndPointRef EndPointId="LR3"/>
                          </Branch>
                          <Branch>
                            <Label>One</Label>
                            <!-- One / One Y -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR3"/>
                          </Branch>
                          <Branch>
                            <Label>Two or More</Label>
                            <!-- Two / Two or more Y's -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR4"/>
                          </Branch>
                        </DecisionPoint>
                      </Branch>
                      <Branch>
                        <Label>&gt;= 20</Label>
                        <!-- Diameter >= 20 -->
                        <GreaterThanOrEqualsCondition DataElementId="diameter"
                          ComparisonValue="diameterLarge"/>
                        <DecisionPoint Id="wasoutCapsultThreDp5">
                          <Label>Washout/Capsule/Thresholdgrowth</Label>
                          <Branch>
                            <Label>None</Label>
                            <!-- None / Zero Y's -->
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <EndPointRef EndPointId="LR3"/>
                          </Branch>
                          <Branch>
                            <Label>One</Label>
                            <!-- One / One Y -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR4"/>
                          </Branch>
                          <Branch>
                            <Label>Two or More</Label>
                            <!-- Two / Two or more Y's -->
                            <OrCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                              <OrCondition>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="no"/>
                                <EqualCondition DataElementId="thresholdgrowth" ComparisonValue="na"/>
                              </OrCondition>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="no"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="no"/>
                            <!-- Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            <AndCondition>
                            <EqualCondition DataElementId="washout"
                            ComparisonValue="yes"/>
                            <!-- Washout = Yes, Capsule = Yes, Thresholdgrowth = Yes -->
                            <EqualCondition DataElementId="capsule"
                            ComparisonValue="yes"/>
                            <EqualCondition DataElementId="thresholdgrowth"
                            ComparisonValue="yes"/>
                            </AndCondition>
                            </OrCondition>
                            <EndPointRef EndPointId="LR4"/>
                          </Branch>
                        </DecisionPoint>
                      </Branch>
                    </DecisionPoint>
                  </Branch>
                  <Branch>
                    <Label> Adjust category</Label>
                    <NotRelevantDataElements>
                      <DataElementRef DataElementId="sixeincreatein6months"/>
                      <DataElementRef DataElementId="HistoryofVisibilityonUS"/>
                    </NotRelevantDataElements>
                    <NotCondition>
                        <EqualCondition DataElementId="adjustcategorybasedonAncillary" ComparisonValue="No"/>
                    </NotCondition>

                    <DecisionPoint Id="AdjustcategoryDp">
                      <Label>Adjust category</Label>
                      <Branch>
                      <Label>Upgrade to LR-2</Label>
                        <EqualCondition DataElementId="adjustcategorybasedonAncillary"
                          ComparisonValue="Upgradetohcc2"/>
                        <EndPointRef EndPointId="LR2"/>
                      </Branch>
                      <Branch>
                      <Label>Upgrade to LR-3</Label>
                        <EqualCondition DataElementId="adjustcategorybasedonAncillary"
                          ComparisonValue="Upgradetohcc3"/>
                        <EndPointRef EndPointId="LR3"/>
                      </Branch>
                      <Branch>
                      <Label>Upgrade to LR-4</Label>
                        <EqualCondition DataElementId="adjustcategorybasedonAncillary"
                          ComparisonValue="Upgradetohcc4"/>
                        <EndPointRef EndPointId="LR4"/>
                      </Branch>
                      <Branch>
                      <Label>Downgrade to LR-4</Label>
                        <EqualCondition DataElementId="adjustcategorybasedonAncillary"
                          ComparisonValue="Downgradetohcc4"/>
                        <EndPointRef EndPointId="LR4"/>
                      </Branch>
                      <Branch>
                        <Label>Downgrade to LR-3</Label>
                        <EqualCondition DataElementId="adjustcategorybasedonAncillary"
                          ComparisonValue="Downgradetohcc3"/>
                        <EndPointRef EndPointId="LR3"/>
                      </Branch>
                      <Branch>
                        <Label>Downgrade to LR-2</Label>
                        <EqualCondition DataElementId="adjustcategorybasedonAncillary"
                          ComparisonValue="Downgradetohcc2"/>
                        <EndPointRef EndPointId="LR2"/>
                      </Branch>
                      <Branch>
                        <Label>Downgrade to LR-1</Label>
                        <EqualCondition DataElementId="adjustcategorybasedonAncillary"
                          ComparisonValue="Downgradetohcc1"/>
                        <EndPointRef EndPointId="LR1"/>
                      </Branch>

                    </DecisionPoint>
                  </Branch>
                </DecisionPoint>
              </Branch>
            </DecisionPoint>
          </Branch>
        </DecisionPoint>
      </Rules>

      <EndPoints>
        <TemplatePartial Id="adjustcategorytext"><!-- Template Partials start -->
          <SectionIfValueNot DataElementId="adjustcategorybasedonAncillary" ComparisonValue="No">
            <SectionIf DataElementId="ancillaryFavoringMalignancy"> LR category has been adjusted based on the selected Ancillary features favoring Malignancy
                <InsertValue DataElementId="ancillaryFavoringMalignancy"/>
            </SectionIf>
            <SectionIf DataElementId="ancillaryFavoringBenignity"> LR category has been adjusted based on the selected Ancillary features favoring Benignity <InsertValue
                DataElementId="ancillaryFavoringBenignity"/>
            </SectionIf>
          </SectionIfValueNot>
        </TemplatePartial>

        <TemplatePartial Id="treatedFindingsReporttext">
          Treated observation#: <InsertValue DataElementId="observationnumber"/>
          Treatment method: <InsertValue DataElementId="TreatmentMethod"/>
          Location:  Segment <InsertValue DataElementId="segmentlocation"/> (image# <InsertValue DataElementId="imagenumber"/>, series# <InsertValue DataElementId="seriesnumber"/>)
          Pretreatment category: <InsertValue DataElementId="pretreatmentCategory"/>
          <SectionIf DataElementId="pretreatmentsize">
          Pretreatment size: <InsertValue DataElementId="pretreatmentsize"/> mm
          </SectionIf>
          <SectionIf DataElementId="irregularattheperiphery"><!-- if any value present -->Enhancement in a nodular or mass like pattern: <InsertValue DataElementId="irregularattheperiphery"/>
          </SectionIf>
          <SectionIf DataElementId="sizeoftheenhancementComponents"><!-- if any value present -->
          Size of largest enhancing component: <InsertValue DataElementId="sizeoftheenhancementComponents"/> mm
          </SectionIf>
          <SectionIf DataElementId="patternofenhancement">
            Enhancement characteristics:
                    Arterial phase hyperenhancement: <SectionIfValue DataElementId="patternofenhancement" ComparisonValue="aphe">Yes</SectionIfValue><SectionIfValueNot DataElementId="patternofenhancement" ComparisonValue="aphe">No</SectionIfValueNot>
                    Washout appearance: <SectionIfValue DataElementId="patternofenhancement" ComparisonValue="washout">Yes
                </SectionIfValue><SectionIfValueNot DataElementId="patternofenhancement" ComparisonValue="washout">No
                </SectionIfValueNot>
            <SectionIfValue DataElementId="patternofenhancement" ComparisonValue="similar_to_pretreatment">
                    Other: Enhancement similar to pretreatment
            </SectionIfValue>
          </SectionIf>
        </TemplatePartial>


        <TemplatePartial Id="treatedimpressiontext">
          Observation# [<InsertValue DataElementId="observationnumber"/>]: <SectionIf DataElementId="sizeoftheenhancementComponents"> [<InsertValue DataElementId="sizeoftheenhancementComponents"/>] mm </SectionIf></TemplatePartial>


        <TemplatePartial Id="untreatedimpressiontext">
          Observation# [<InsertValue DataElementId="observationnumber"/>]:  <SectionIf DataElementId="pretreatmentsize" >[<InsertValue DataElementId="pretreatmentsize"/>] mm
          </SectionIf>
        </TemplatePartial>

        <TemplatePartial Id="untreatreporttext">
          Observation#: <InsertValue DataElementId="observationnumber"/>
            Location:  Segment <InsertValue DataElementId="segmentlocation"/>&amp;nbsp;
          <SectionIf DataElementId="diameter">
              Size: <InsertValue DataElementId="diameter"/> mm (image# <InsertValue DataElementId="imagenumber"/>, series# <InsertValue DataElementId="seriesnumber"/>)
          </SectionIf>
          <SectionIf DataElementId="arterialEnhancement">
            Nonrim arterial phase hyperenhancement: <InsertValue DataElementId="arterialEnhancement"/>
          </SectionIf>
          <SectionIf DataElementId="washout">
            Nonperipheral "washout": <InsertValue DataElementId="washout"/>
          </SectionIf>
          <SectionIf DataElementId="capsule" >
              Enhancing "capsule": <SectionIfValue DataElementId="capsule" ComparisonValue="yes">Present
              </SectionIfValue><SectionIfValue DataElementId="capsule" ComparisonValue="no">Absent</SectionIfValue>
          </SectionIf>
          <SectionIf DataElementId="thresholdgrowth" >
            Threshold growth: <InsertValue DataElementId="thresholdgrowth"/>
          </SectionIf>
          <SectionIf DataElementId="ancillaryFavoringBenignity" >Ancillary Feature Favoring benignity: <InsertValue DataElementId="ancillaryFavoringBenignity"/>
          </SectionIf>			<SectionIf DataElementId="ancillaryFavoringMalignancy" >Ancillary Feature Favoring malignancy: <InsertValue DataElementId="ancillaryFavoringMalignancy"/>
          </SectionIf>
        </TemplatePartial>


        <!-- Template Partials end -->

        <!-- Untreated Endpoints start -->

        <EndPoint Id="LRNC">
          <Label>LR-NC</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
                Overall assessment: LI-RADS category [LR-NC,Noncategorizable]
              <InsertPartial
                PartialId="adjustcategorytext"/>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-NC](Noncategorizable) in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LR1">
          <Label>LR-1</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
              Overall assessment: LI-RADS category [LR-1, Definitely benign]<SectionIf DataElementId="LR1Features"> ,&amp;nbsp;<InsertValue DataElementId="LR1Features"></InsertValue></SectionIf>
              <InsertPartial
                PartialId="adjustcategorytext"/>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-1](Definitely benign) in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LR2">
          <Label>LR-2</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
              Overall assessment: LI-RADS category [LR-2, Probably benign]<SectionIf DataElementId="LR2features"> ,&amp;nbsp;<InsertValue DataElementId="LR2features"></InsertValue></SectionIf>
              <InsertPartial
                PartialId="adjustcategorytext"/>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-2](Probably benign) in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LR3">
          <Label>LR-3</Label>

          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
              Overall assessment: LI-RADS category [LR-3, Intermediate probability of malignancy]
              <InsertPartial
                PartialId="adjustcategorytext"/>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-3] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LR4">
          <Label>LR-4</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
              Overall assessment: LI-RADS category [LR-4, Probably HCC]
              <InsertPartial
                PartialId="adjustcategorytext"/>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-4] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LR5">
          <Label>LR-5</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
              Overall assessment: LI-RADS category [LR-5, Definitely HCC]
              <InsertPartial
                PartialId="adjustcategorytext"/>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-5] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LRTIV_Etiology_uncertain">
          <Label>[LR-TIV, Etiology uncertain]</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
                Overall assessment: LI-RADS category [LR-TIV, Etiology uncertain]
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-TIV, Etiology uncertain] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LRTIV_proabably_hcc">
          <Label>[LR-TIV, Probably due to HCC]</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
                Overall assessment: LI-RADS category [LR-TIV, Probably due to HCC]
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-TIV, Probably due to HCC] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LRTIV_non_hcc">
          <Label>[LR-TIV, May be due to non-HCC malignancy]</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
                Overall assessment: LI-RADS category [LR-TIV, May be due to non-HCC malignancy]
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-TIV, May be due to non-HCC malignancy] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LRTIV_def_hcc">
          <Label>[LR-TIV, Definitely due to HCC] </Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
                Overall assessment: LI-RADS category [LR-TIV, Definitely due to HCC]
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-TIV, Definitely due to HCC] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LRM">
          <Label>LR-M</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
              LR-M features: <SectionIf DataElementId="lrmtargetoidmass"> <InsertValue DataElementId="lrmtargetoidmass"/> </SectionIf> <SectionIf DataElementId="lrmnontargetoidmass"> <InsertValue DataElementId="lrmnontargetoidmass"/>&amp;nbsp;

              </SectionIf>
              &amp;nbsp;
              Overall assessment: LI-RADS category [LR-M, Probably or definitely malignant but not HCC specific]
              <InsertPartial
                PartialId="adjustcategorytext"/>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-M] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LR5g">
          <Label>LR-5g</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
                Overall assessment: LI-RADS category [LR-5g]
              <InsertPartial
                PartialId="adjustcategorytext"/>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-5g] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LR5us">
          <Label>LR-5us</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="untreatreporttext"/>
                Overall assessment: LI-RADS category [LR-5us]
              <InsertPartial
              PartialId="adjustcategorytext"/>
            </ReportText>

            <ReportText SectionId="impression">
              <InsertPartial PartialId="untreatedimpressiontext"/>
              [LR-5us] in segment [<InsertValue DataElementId="segmentlocation"/>]
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <!-- Untreated Endpoints end -->

        <!-- Treated Endpoints start -->

        <EndPoint Id="LRTRNonevaluable">
          <Label>LR-TR Nonevaluable</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="treatedFindingsReporttext"/>
              Overall assessment: [LR-TR Nonevaluable]&amp;nbsp;
              <SectionIfValue DataElementId="pretreatmentCategory" ComparisonValue="Unknown" >
                (pretreatment unknown)
              </SectionIfValue>
              <SectionIfValueNot DataElementId="pretreatmentCategory" ComparisonValue="Unknown">
                (pretreatment&amp;nbsp;<InsertValue DataElementId="pretreatmentCategory"/>,&amp;nbsp;<InsertValue DataElementId="pretreatmentsize"/>&amp;nbsp;mm)
              </SectionIfValueNot>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="treatedimpressiontext"/>
              [LR-TR Nonevaluable] &amp;nbsp;(pretreatment&amp;nbsp;<InsertValue DataElementId="pretreatmentCategory"/>,&amp;nbsp;<InsertValue DataElementId="pretreatmentsize"/>&amp;nbsp;mm)
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LRTRNonviable">
          <Label>LR-TR Nonviable</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="treatedFindingsReporttext"/>
                Overall assessment: [LR-TR Nonviable]&amp;nbsp;
              <SectionIfValue DataElementId="pretreatmentCategory" ComparisonValue="Unknown" >
                (pretreatment unknown)
              </SectionIfValue>
              <SectionIfValueNot DataElementId="pretreatmentCategory" ComparisonValue="Unknown">
                (pretreatment&amp;nbsp;<InsertValue DataElementId="pretreatmentCategory"/>,&amp;nbsp;<InsertValue DataElementId="pretreatmentsize"/>&amp;nbsp;mm)
              </SectionIfValueNot>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="treatedimpressiontext"/>
              [LR-TR Nonviable]&amp;nbsp;(pretreatment &amp;nbsp;<InsertValue DataElementId="pretreatmentCategory"/>,&amp;nbsp;<InsertValue DataElementId="pretreatmentsize"/>&amp;nbsp;mm)
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LRTREquivoca">
          <Label>LR-TR Equivocal</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="treatedFindingsReporttext"/>
                Overall assessment: [LR-TR Equivocal]&amp;nbsp;
              <InsertValue DataElementId="sizeoftheenhancementComponents"/>&amp;nbsp;mm &amp;nbsp;
              <SectionIfValue DataElementId="pretreatmentCategory" ComparisonValue="Unknown" >
                (pretreatment unknown)
              </SectionIfValue>
              <SectionIfValueNot DataElementId="pretreatmentCategory" ComparisonValue="Unknown">
                (pretreatment &amp;nbsp;<InsertValue DataElementId="pretreatmentCategory"/>,&amp;nbsp;<InsertValue DataElementId="pretreatmentsize"/>&amp;nbsp;mm)
              </SectionIfValueNot>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="treatedimpressiontext"/> [LR-TR Equivocal] &amp;nbsp;(pretreatment&amp;nbsp;<InsertValue DataElementId="pretreatmentCategory"/>, &amp;nbsp;<InsertValue DataElementId="pretreatmentsize"/>&amp;nbsp;mm)
            </ReportText>
          </ReportTexts>
        </EndPoint>

        <EndPoint Id="LRTRViable">
          <Label>LR-TR Viable</Label>
          <ReportTexts>
            <ReportText SectionId="findings">
              <InsertPartial PartialId="treatedFindingsReporttext"/>
                Overall assessment: [LR-TR Viable]&amp;nbsp;
              <InsertValue DataElementId="sizeoftheenhancementComponents"/>&amp;nbsp;mm &amp;nbsp;
              <SectionIfValue DataElementId="pretreatmentCategory" ComparisonValue="Unknown" >
                (pretreatment unknown)
              </SectionIfValue>
              <SectionIfValueNot DataElementId="pretreatmentCategory" ComparisonValue="Unknown">
                (pretreatment &amp;nbsp;<InsertValue DataElementId="pretreatmentCategory"/>,&amp;nbsp;<InsertValue DataElementId="pretreatmentsize"/>&amp;nbsp;mm)
              </SectionIfValueNot>
            </ReportText>
            <ReportText SectionId="impression">
              <InsertPartial PartialId="treatedimpressiontext"/>
              [LR-TR Viable] (pretreatment&amp;nbsp;<InsertValue DataElementId="pretreatmentCategory"/>,&amp;nbsp;<InsertValue DataElementId="pretreatmentsize"/>&amp;nbsp;mm)
            </ReportText>
          </ReportTexts>
        </EndPoint>
        <!-- Treated Endpoints end -->
      </EndPoints>
    </ReportingModule>`;

    template = mockTemplateManagerService.getTemplate(component.xmlContent);

    component.templatePartial = template.templatePartial;
    component.endPointXMLString = template.endPointsString;
    component.dataElements = template.dataElements;

    component.imagePath = 'XMLFiles/Samples/LIRADS';
  }

  function initialiseEngineService() {
    if (template === undefined) {
      template = new Template();
      template.dataElements = component.dataElements;
    }
    mockSimulatorEngineService.initialize(template);
  }

  function createNumericSelectionEvent(id, label, value) {
    selectedCondition = new SelectedCondition();
    selectedCondition.selectedConditionId = id;
    selectedCondition.selectedCondition = label;
    selectedCondition.selectedValue = value;

    numericDataElement = new NumericElement();
    numericDataElement.elementId = id;
    numericDataElement.selectedValue = value;

    return { receivedElement: numericDataElement, selectedCondition: selectedCondition }
  }

  function createChoiceSelectionEvent(id, label, value, selectedText) {
    selectedCondition = new SelectedCondition();
    selectedCondition.selectedConditionId = id;
    selectedCondition.selectedCondition = label;
    selectedCondition.selectedValue = value;

    choiceDataElement = new ChoiceElement();
    choiceDataElement.elementId = id;
    choiceDataElement.selectedValue = value;
    choiceDataElement.selectedText = selectedText;

    return { receivedElement: choiceDataElement, selectedCondition: selectedCondition }
  }

  function createMultiChoiceSelectionEvent(id, label, selectedValue, selectedValues, comparisonValues) {
    selectedCondition = new SelectedCondition();
    selectedCondition.selectedConditionId = id;
    selectedCondition.selectedCondition = label;
    selectedCondition.selectedValue = selectedValue;

    multiChoiceDataElement = new MultiChoiceElement();
    multiChoiceDataElement.elementId = id;
    multiChoiceDataElement.selectedValues = selectedValues;
    multiChoiceDataElement.selectedComparisonValues = comparisonValues;

    return { receivedElement: multiChoiceDataElement, selectedCondition: selectedCondition }
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
    setTemplateDataOfLymph_Nodes();
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
    expect(nativeElement.querySelectorAll('acr-assist-choice-element').length).toEqual(7);

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

  it('Called numericSelected(event), multiSelected($event), choiceSelected($event) with a valid event to generate ' +
     'treated observation report text', () => {
    setTemplateDataOfLirads();
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    // Numeric select
    event = createNumericSelectionEvent('observationnumber', 'Observation#', 2);
    component.numericSelected(event);

    event = createNumericSelectionEvent('seriesnumber', 'Series#', 2);
    component.numericSelected(event);

    event = createNumericSelectionEvent('imagenumber', 'Image#', 2);
    component.numericSelected(event);

    event = createNumericSelectionEvent('pretreatmentsize', 'What is the pretreatment size in mm?', 2);
    component.numericSelected(event);

    // Choice select
    event = createChoiceSelectionEvent('observationinPatient', 'Observation in high-risk patient', 'treated',
                                                 'Treated observation');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('treatedobservation', 'Treated observation features', 'otherwise',
    'otherwise');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('segmentlocation', 'Segment#', 'I', 'I');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('lesionalenhancement', 'Is there lesional enhancement?', 'yes', 'Yes');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('enhancementisexpectedpattern', 'Enhancement in an expected  treatment-specific pattern?'
                                       , 'no', 'No');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('irregularattheperiphery', 'Is enhancement nodular OR mass-like OR thick irregular at the periphery?'
                                       , 'yes', 'Yes');
    component.choiceSelected(event);

    // Multi Chocie select
    let selectedValue = ['Ablation - type not specified', 'RF ablation', 'Microwave ablation'];
    let selectedValues = ['Ablation - type not specified', 'RF ablation', 'Microwave ablation'];
    let selectedComparisonValues = ['Ablation_Type_Unknown', 'RF_ablation', 'Microwave_ablation'];

    event = createMultiChoiceSelectionEvent('TreatmentMethod', 'Treatment method', selectedValue,
                                                              selectedValues, selectedComparisonValues);

    component.multiSelected(event);

    selectedValue = ['Arterial phase hyperenhancement', 'Washout" (washout appearance)'];
    selectedValues = ['Arterial phase hyperenhancement', 'Washout" (washout appearance)'];
    selectedComparisonValues = ['aphe', 'washout'];

    event = createMultiChoiceSelectionEvent('patternofenhancement', 'Pattern of enhancement', selectedValue,
                                                              selectedValues, selectedComparisonValues);

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
    executionHistory.executionHistories.forEach(element => {
      expect(element.resultCondition).toBeDefined();
      expect(element.resultCondition).toBeTruthy();
      expect(element.resultValue).toBeDefined();
      expect(element.resultValue).toBeTruthy();
    });

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

  it('Called numericSelected(event), multiSelected($event), choiceSelected($event) with a valid event to generate ' +
     'untreated observation report text', () => {
    setTemplateDataOfLirads();
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    // Choice select
    event = createChoiceSelectionEvent('observationinPatient', 'Observation in high-risk patient', 'untreated',
      'Untreated observation');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('untreatedobservation',
      'Untreated observation without pathologic proof in patient at high-risk for HCC',
      'malignantbutnothcc', 'Probably or definitely malignant but not HCC specific');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('adjustcategorybasedonAncillary', 'Do you want to adjust category based on ancillary features?'
      , 'No', 'No');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('segmentlocation', 'Segment#', 'I', 'I');
    component.choiceSelected(event);

    // Numeric select
    event = createNumericSelectionEvent('observationnumber', 'Observation#', 2);
    component.numericSelected(event);

    event = createNumericSelectionEvent('seriesnumber', 'Series#', 2);
    component.numericSelected(event);

    event = createNumericSelectionEvent('imagenumber', 'Image#', 2);
    component.numericSelected(event);

    event = createNumericSelectionEvent('pretreatmentsize', 'What is the pretreatment size in mm?', 2);
    component.numericSelected(event);

    event = createNumericSelectionEvent('diameter', 'Observation size (mm)', 2);
    component.numericSelected(event);

    event = createNumericSelectionEvent('sizeoftheenhancementComponents', 'Size of largest enhancing component (in mm)', 2);
    component.numericSelected(event);

    // Multi Chocie select
    let selectedValue = ['Rim APHE', 'Peripheral “washout”'];
    let selectedValues = ['Rim APHE', 'Peripheral “washout”'];
    let selectedComparisonValues = ['Rim_APHE', 'Peripheral_washout'];

    event = createMultiChoiceSelectionEvent('lrmtargetoidmass', 'Targetoid mass (any of the following)', selectedValue,
      selectedValues, selectedComparisonValues);

    component.multiSelected(event);

    selectedValue = ['Infiltrative appearance', 'Marked_diffusion_restriction'];
    selectedValues = ['Infiltrative appearance', 'Marked_diffusion_restriction'];
    selectedComparisonValues = ['Infiltrative_appearance', 'Marked_diffusion_restriction'];

    event = createMultiChoiceSelectionEvent('lrmnontargetoidmass', 'Nontargetoid mass (NOT LR-5 and no TIV)', selectedValue,
      selectedValues, selectedComparisonValues);

    selectedValue = ['US visibility as discrete nodule', 'Subthreshold growth'];
    selectedValues = ['US visibility as discrete nodule', 'Subthreshold growth'];
    selectedComparisonValues = ['US_visibility_as_discrete_nodule', 'Subthreshold_growth'];

    event = createMultiChoiceSelectionEvent('ancillaryFavoringMalignancy', 'Are there ancillary features favoring malignancy?'
      , selectedValue, selectedValues, selectedComparisonValues);

    selectedValue = ['Size stability ≥ 2 years', 'Size reduction'];
    selectedValues = ['Size stability ≥ 2 years', 'Size reduction'];
    selectedComparisonValues = ['Size_stability_≥_2_years', 'Size_reduction'];

    event = createMultiChoiceSelectionEvent('ancillaryFavoringBenignity', 'Are there ancillary features favoring benignity?'
      , selectedValue, selectedValues, selectedComparisonValues);
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
    executionHistory.executionHistories.forEach(element => {
      expect(element.resultCondition).toBeDefined();
      expect(element.resultCondition).toBeTruthy();
      expect(element.resultValue).toBeDefined();
      expect(element.resultValue).toBeTruthy();
    });

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
    setTemplateDataOfLirads();
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

  it('Called choiceSelected(event) with a invalid event to generate execution history', () => {
    setTemplateDataOfLirads();
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

  it('Called multiSelected(event) with a invalid event to generate execution history', () => {
    setTemplateDataOfLirads();
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
    setTemplateDataOfLirads();
    initialiseEngineService();

    const endPointId = 'LRTRNonevaluable';

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
    setTemplateDataOfLirads();
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
    setTemplateDataOfLirads();
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

  it('Called numericSelected(event), multiSelected($event), choiceSelected($event) with a valid event to generate ' +
     'lymphnodes report text', () => {
    setTemplateDataOfLymph_Nodes();
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    // Multi Chocie select
    const selectedValue = ['I', 'II'];
    const selectedValues = ['I', 'II'];
    const selectedComparisonValues = ['I', 'II'];

    event = createMultiChoiceSelectionEvent('levelsinvolved', 'Which levels involved?', selectedValue,
                                                              selectedValues, selectedComparisonValues);

    component.multiSelected(event);

    // Choice select
    event = createChoiceSelectionEvent('laterality', 'Laterality', 'bilateral', 'Bilateral');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('singlemultiple', 'Number of nodes', 'Single', 'Single');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('degreeofcertainty', 'ECS (degree of certainty)', 'possible', 'Possible');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('enhancement_pattern', 'Pattern of enhancement', 'cystic', 'Cystic');
    component.choiceSelected(event);

    event = createChoiceSelectionEvent('drainagepattern', 'Are these nodes in expected drainage pattern?', 'no', 'No');
    component.choiceSelected(event);

    // Numeric select
    event = createNumericSelectionEvent('sizeoflargestcluster', 'Size of largest cluster(in mm)', 1);
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
    executionHistory.executionHistories.forEach(element => {
      expect(element.resultCondition).toBeDefined();
      expect(element.resultCondition).toBeTruthy();
      expect(element.resultValue).toBeDefined();
      expect(element.resultValue).toBeTruthy();
    });

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

  it('Called choiceSelected($event) with a valid event to generate ' +
     'lung rads report text', () => {
    setTemplateDataOfLungRads();
    initialiseEngineService();

    component.returnReportText.subscribe(data => {
      reportData = data;
    });

    component.returnExecutionHistory.subscribe(data => {
      executionHistory = data;
    });

    // Choice select
    event = createChoiceSelectionEvent('baseCategory', 'Category of findings', 'cat1NoLungNodules', '1: No lung nodules');
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
    executionHistory.executionHistories.forEach(element => {
      expect(element.resultCondition).toBeDefined();
      expect(element.resultCondition).toBeTruthy();
      expect(element.resultValue).toBeDefined();
      expect(element.resultValue).toBeTruthy();
    });

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
});
