import { TestBed, inject } from '@angular/core/testing';

import { SimulatorEngineService } from './simulator-engine.service';
import { Template } from '../models/template.model';
import { NumericDataElement } from '../elements/models/numeric-data-element.model';
import { ChoiceDataElement } from '../elements/models/choice-data-element-model';
import { GlobalValue } from '../elements/models/globalvalue.model';
import { Choice } from '../elements/models/choice.model';
import { BaseDataElement } from '../elements/models/base-data-element.model';
import { Metadata } from '../metadata/models/metadata-model';
import { Diagram } from '../models/diagram.model';
import { Rules } from '../rules/models/rules.model';
import { DecisionPoint } from '../models/decisionpoint.model';
import { Branch } from '../models/branch.model';
import { EndPointRef } from '../models/endpointref.model';
import { ConditionType } from '../models/conditiontype.model';
import { EqualCondition } from '../rules/equal-condition';
import { SimulatorState } from '../models/simulator-state.model';
import { ComputedDataElement } from '../elements/models/computed-data-element-model';
import { TextExpression } from '../models/text-expression.model';
import { Component } from '@angular/core';

class MockSimulatorEngineService extends SimulatorEngineService {
}

describe('SimulatorEngineService', () => {
  let mockedSimulatorEngineService: SimulatorEngineService;
  let numericDataElement: NumericDataElement;
  let multiChoiceDataElement: ChoiceDataElement;
  let choiceDataElement: ChoiceDataElement;
  let globalDataElement: GlobalValue;
  let computedDataElement: ComputedDataElement;
  let template: Template;
  let choice: Choice;
  let xmlContent: string;
  let templatePartial: string[];
  let endPointXMLString: string[];
  let dataElements: BaseDataElement[];
  let simulatorState: SimulatorState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SimulatorEngineService, useClass: MockSimulatorEngineService }]
    });

    mockedSimulatorEngineService = TestBed.get(SimulatorEngineService);
  });

  afterEach(() => {
    mockedSimulatorEngineService = undefined;
    numericDataElement = undefined;
    multiChoiceDataElement = undefined;
    choiceDataElement = undefined;
    globalDataElement = undefined;
    computedDataElement = undefined;
    template = undefined;
    choice = undefined;
    xmlContent = '';
    templatePartial = undefined;
    endPointXMLString = undefined;
    dataElements = undefined;
    simulatorState = undefined;
  });

  function setTemplateData() {
    xmlContent = `
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

    templatePartial = [ `
    <TemplatePartial Id ="ExamPartial">
      EXAMINATION:  CT NECK WITH CONTRAST
      EXAM DATE AND TIME: 5/9/2018 1:30 PM EDT
      INDICATION: neck swelling
      COMPARISON: None available.
    </TemplatePartial>`];

     endPointXMLString = [`
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

    dataElements = [];

    createGlobalDataElement();
    createIntegerDataElement();
    createChoiceDataElement();
    createMultiChoiceDataElement();
    createComputedDataElement();
  }

  function createGlobalDataElement() {
    globalDataElement = new GlobalValue();
    globalDataElement.currentValue = '10';
    globalDataElement.dataElementType = 'GlobalValue';
    globalDataElement.id = 'conditionConst';
    globalDataElement.isVisible = true;

    dataElements.push(globalDataElement);
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

    dataElements.push(numericDataElement);
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

    dataElements.push(choiceDataElement);
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

    dataElements.push(multiChoiceDataElement);
  }

  function createComputedDataElement() {
    computedDataElement = new ComputedDataElement();
    computedDataElement.cdeId = undefined;
    computedDataElement.currentValue = undefined;
    computedDataElement.computeValue = undefined;
    computedDataElement.dataElementType = 'ComputedDataElement';
    computedDataElement.defaultValue = undefined;
    computedDataElement.displaySequence = undefined;
    computedDataElement.hint = undefined;
    computedDataElement.id = 'hasSelectedBaseCategory';
    computedDataElement.isRequired = false;
    computedDataElement.isVisible = true;
    computedDataElement.label = undefined;
    computedDataElement.decisionPoints = [];

    const decisionPoint = new DecisionPoint();
    decisionPoint.label = undefined;

    computedDataElement.decisionPoints.push(decisionPoint);
    computedDataElement.decisionPoints[0].branches = [];

    const branch = new Branch();
    branch.computedValue = new TextExpression();
    branch.computedValue.expressionText = 'There is a potentially significant incidental finding.';
    branch.label = undefined;

    const conditionType = new ConditionType();
    conditionType.comparisonValue = 'yes';
    conditionType.dataElementId = 'significantAdditionalFindings';
    branch.condition = new EqualCondition(conditionType);

    computedDataElement.decisionPoints[0].branches.push(branch);

    dataElements.push(computedDataElement);
  }

  function initialiseEngineService() {
    template = new Template();
    template.dataElements = dataElements;
    template.xmlContent = xmlContent;
    template.endPointsString = endPointXMLString;
    template.templatePartial = templatePartial;
    template.metadata = createMetaData();
    template.rules = createRules();

    mockedSimulatorEngineService.initialize(template);
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

  it('Created the SimulatorEngineService', inject([SimulatorEngineService], (service: SimulatorEngineService) => {
    expect(service).toBeTruthy();
  }));

  it('Created same instance type of Mocked Service and Original Service', () => {
    expect(mockedSimulatorEngineService instanceof SimulatorEngineService).toBeTruthy();
  });

  it('Called getAllDataElementValues() without initializing the template', () => {

    // Checks the data element values
    const elementValues = mockedSimulatorEngineService.getAllDataElementValues();
    expect(elementValues).toBeDefined();
    expect(elementValues).toBeTruthy();
    expect(elementValues['conditionConst']).toBeUndefined();
    expect(elementValues['levelsinvolved']).toBeUndefined();
    expect(elementValues['singlemultiple']).toBeUndefined();
    expect(elementValues['sizeoflargestcluster']).toBeUndefined();
  });

  it('Called getAllDataElementValues() by initializing the template', () => {
    setTemplateData();
    initialiseEngineService();

    // Checks the data element values
    const elementValues = mockedSimulatorEngineService.getAllDataElementValues();
    expect(elementValues).toBeDefined();
    expect(elementValues).toBeTruthy();
    expect(elementValues['conditionConst']).toBeDefined();
    expect(elementValues['conditionConst']).toEqual('10');
    expect(elementValues['levelsinvolved']).toBeUndefined();
    expect(elementValues['singlemultiple']).toBeUndefined();
    expect(elementValues['sizeoflargestcluster']).toBeUndefined();
  });

  it('Called getAllDataElementTexts() without initializing the template', () => {

    // Checks the data element texts
    const elementTexts = mockedSimulatorEngineService.getAllDataElementTexts();
    expect(elementTexts).toBeDefined();
    expect(elementTexts).toBeTruthy();
    expect(elementTexts['conditionConst']).toBeUndefined();
    expect(elementTexts['levelsinvolved']).toBeUndefined();
    expect(elementTexts['singlemultiple']).toBeUndefined();
    expect(elementTexts['sizeoflargestcluster']).toBeUndefined();
  });

  it('Called getAllDataElementTexts() by initializing the template', () => {
    setTemplateData();
    initialiseEngineService();

    // Checks the data element texts
    const elementTexts = mockedSimulatorEngineService.getAllDataElementTexts();
    expect(elementTexts).toBeDefined();
    expect(elementTexts).toBeTruthy();
    expect(elementTexts['conditionConst']).toBeUndefined();
    expect(elementTexts['levelsinvolved']).toBeUndefined();
    expect(elementTexts['singlemultiple']).toBeUndefined();
    expect(elementTexts['sizeoflargestcluster']).toBeUndefined();
  });

  it('Called getDataElementValue(dataElementId: string) without initializing the template', () => {

    // Checks the data element values
    const elementValue = mockedSimulatorEngineService.getDataElementValue('conditionConst');
    expect(elementValue).toBeUndefined();
  });

  it('Called getDataElementValue(dataElementId: string) by initializing the template', () => {
    setTemplateData();
    initialiseEngineService();

    // Checks the data element values
    const elementValue = mockedSimulatorEngineService.getDataElementValue('conditionConst');
    expect(elementValue).toBeDefined();
    expect(elementValue).toBeTruthy();
    expect(elementValue).toEqual('10');
  });

  it('Called getDataElementText(dataElementId: string) without initializing the template', () => {

    // Checks the data element texts
    const elementText = mockedSimulatorEngineService.getDataElementText('conditionConst');
    expect(elementText).toBeUndefined();
  });

  it('Called getDataElementText(dataElementId: string) by initializing the template', () => {
    setTemplateData();
    initialiseEngineService();

    // Checks the data element texts
    const elementText = mockedSimulatorEngineService.getDataElementText('conditionConst');
    expect(elementText).toBeUndefined();
  });

  it('Called addOrUpdateDataElement(dataElementId: string, value: any , text: any) with non computed element by initializing ' +
     'the template', () => {
    setTemplateData();
    initialiseEngineService();
    const dataElementId = 'sizeoflargestcluster';
    const dataElementValue = '5';
    const dataElementText = '5';

    mockedSimulatorEngineService.simulatorStateChanged.subscribe((message) => {
      simulatorState =  message as  SimulatorState;
    });

    const addOrUpdateDataElement = function () {
      try {
        mockedSimulatorEngineService.addOrUpdateDataElement(dataElementId, dataElementValue, dataElementText);
      } catch (error) {
        throw error;
      }
    };

    // addOrUpdateDataElement method should not throw as template is not intialized
    expect(addOrUpdateDataElement).not.toThrow();

    // Checks the data element values
    const elementValues = mockedSimulatorEngineService.getAllDataElementValues();

    expect(elementValues).toBeDefined();
    expect(elementValues).toBeTruthy();
    expect(elementValues['conditionConst']).toBeDefined();
    expect(elementValues['conditionConst']).toEqual('10');
    expect(elementValues['levelsinvolved']).toBeUndefined();
    expect(elementValues['singlemultiple']).toBeUndefined();
    expect(elementValues['sizeoflargestcluster']).toBeDefined();
    expect(elementValues['sizeoflargestcluster']).toEqual(dataElementValue);

    // Checks the data element texts
    const elementTexts = mockedSimulatorEngineService.getAllDataElementTexts();

    expect(elementTexts).toBeDefined();
    expect(elementTexts).toBeTruthy();
    expect(elementTexts['conditionConst']).toBeUndefined();
    expect(elementTexts['levelsinvolved']).toBeUndefined();
    expect(elementTexts['singlemultiple']).toBeUndefined();
    expect(elementTexts['sizeoflargestcluster']).toBeDefined();
    expect(elementTexts['sizeoflargestcluster']).toEqual(dataElementText);

    // Checks the simulator content state
    expect(simulatorState).toBeDefined();
    expect(simulatorState.endPointId).toBeDefined();
    expect(simulatorState.endPointId).toEqual(template.rules.decisionPoints[0].branches[0].endPointRef.endPointId);
    expect(simulatorState.nonRelevantDataElementIds).toBeDefined();
    expect(simulatorState.selectedBranchLabel).toBeUndefined();
    expect(simulatorState.selectedDecisionPointId).toBeDefined();
    expect(simulatorState.selectedDecisionPointId).toEqual(template.rules.decisionPoints[0].id);
    expect(simulatorState.selectedDecisionPointLabel).toBeDefined();
    expect(simulatorState.selectedDecisionPointLabel).toEqual(template.rules.decisionPoints[0].label);
  });

  it('Called addOrUpdateDataElement(dataElementId: string, value: any , text: any) with computed element by initializing ' +
     'the template', () => {
    setTemplateData();
    initialiseEngineService();
    const dataElementId = 'significantAdditionalFindings';
    const dataElementValue = 'yes';
    const dataElementText = 'yes';

    mockedSimulatorEngineService.simulatorStateChanged.subscribe((message) => {
      simulatorState =  message as  SimulatorState;
    });

    const addOrUpdateDataElement = function () {
      try {
        mockedSimulatorEngineService.addOrUpdateDataElement(dataElementId, dataElementValue, dataElementText);
      } catch (error) {
        throw error;
      }
    };

    // addOrUpdateDataElement method should not throw as template is not intialized
    expect(addOrUpdateDataElement).not.toThrow();

    // Checks the data element values
    const elementValues = mockedSimulatorEngineService.getAllDataElementValues();

    expect(elementValues).toBeDefined();
    expect(elementValues).toBeTruthy();
    expect(elementValues['conditionConst']).toBeDefined();
    expect(elementValues['conditionConst']).toEqual('10');
    expect(elementValues['levelsinvolved']).toBeUndefined();
    expect(elementValues['singlemultiple']).toBeUndefined();
    expect(elementValues['sizeoflargestcluster']).toBeUndefined();
    expect(elementValues['significantAdditionalFindings']).toBeDefined();
    expect(elementValues['significantAdditionalFindings']).toEqual(dataElementValue);

    // Checks the data element texts
    const elementTexts = mockedSimulatorEngineService.getAllDataElementTexts();

    expect(elementTexts).toBeDefined();
    expect(elementTexts).toBeTruthy();
    expect(elementTexts['conditionConst']).toBeUndefined();
    expect(elementTexts['levelsinvolved']).toBeUndefined();
    expect(elementTexts['singlemultiple']).toBeUndefined();
    expect(elementTexts['sizeoflargestcluster']).toBeUndefined();
    expect(elementTexts['significantAdditionalFindings']).toBeDefined();
    expect(elementTexts['significantAdditionalFindings']).toEqual(dataElementText);

    // Checks the simulator content state
    expect(simulatorState).toBeDefined();
    expect(simulatorState.endPointId).toBeDefined();
    expect(simulatorState.endPointId).toEqual(template.rules.decisionPoints[0].branches[0].endPointRef.endPointId);
    expect(simulatorState.nonRelevantDataElementIds).toBeDefined();
    expect(simulatorState.selectedBranchLabel).toBeUndefined();
    expect(simulatorState.selectedDecisionPointId).toBeDefined();
    expect(simulatorState.selectedDecisionPointId).toEqual(template.rules.decisionPoints[0].id);
    expect(simulatorState.selectedDecisionPointLabel).toBeDefined();
    expect(simulatorState.selectedDecisionPointLabel).toEqual(template.rules.decisionPoints[0].label);
  });

  it('Called addOrUpdateDataElement(dataElementId: string, value: any , text: any) without initializing the template', () => {
    const dataElementId = 'sizeoflargestcluster';
    const dataElementValue = '5';
    const dataElementText = '5';

    const addOrUpdateDataElement = function () {
      try {
        mockedSimulatorEngineService.addOrUpdateDataElement(dataElementId, dataElementValue, dataElementText);
      } catch (error) {
        throw error;
      }
    };

    // addOrUpdateDataElement method should throw as template is intialized
    expect(addOrUpdateDataElement).toThrow();
  });

  it('Called evaluateDecisionPoint(decisionPoint: DecisionPoint,  branchingLevel, nonRelevantDataElementIds: string[] = []) ' +
     'without initializing the template', () => {
    const decisionPoint = undefined;
    const branchingLevel = '0';
    const nonRelevantDataElementIds = [];

    const evaluateDecisionPoint = function () {
      try {
        mockedSimulatorEngineService.evaluateDecisionPoint(decisionPoint, branchingLevel, nonRelevantDataElementIds);
      } catch (error) {
        throw error;
      }
    };

    // evaluateDecisionPoint method should throw as template is not intialized
    expect(evaluateDecisionPoint).toThrow();
  });

  it('Called evaluateDecisionPoint(decisionPoint: DecisionPoint,  branchingLevel, nonRelevantDataElementIds: string[] = []) ' +
     'by initializing the template and passing nonRelevantDataElementIds', () => {
    setTemplateData();
    initialiseEngineService();

    const decisionPoint = template.rules.decisionPoints[0];
    const branchingLevel = '0';
    const nonRelevantDataElementIds = ['singlemultiple'];

    const evaluateDecisionPoint = function () {
      try {
        mockedSimulatorEngineService.evaluateDecisionPoint(decisionPoint, branchingLevel, nonRelevantDataElementIds);
      } catch (error) {
        throw error;
      }
    };

    mockedSimulatorEngineService.simulatorStateChanged.subscribe((message) => {
      simulatorState =  message as  SimulatorState;
    });

    // evaluateDecisionPoint method should not throw as template is intialized
    expect(evaluateDecisionPoint).not.toThrow();

    // Checks the simulator content state
    expect(simulatorState).toBeDefined();
    expect(simulatorState.endPointId).toBeDefined();
    expect(simulatorState.endPointId).toEqual(template.rules.decisionPoints[0].branches[0].endPointRef.endPointId);
    expect(simulatorState.nonRelevantDataElementIds).toBeDefined();
    expect(simulatorState.selectedBranchLabel).toBeUndefined();
    expect(simulatorState.selectedDecisionPointId).toBeDefined();
    expect(simulatorState.selectedDecisionPointId).toEqual(template.rules.decisionPoints[0].id);
    expect(simulatorState.selectedDecisionPointLabel).toBeDefined();
    expect(simulatorState.selectedDecisionPointLabel).toEqual(template.rules.decisionPoints[0].label);
  });

  it('Called evaluateDecisionPoint(decisionPoint: DecisionPoint,  branchingLevel, nonRelevantDataElementIds: string[] = [])' +
     'by initializing the template and endOfRoadReached true', () => {
       setTemplateData();
       initialiseEngineService();

       const decisionPoint = template.rules.decisionPoints[0];
       const branchingLevel = '0';
       const nonRelevantDataElementIds = undefined;

       mockedSimulatorEngineService.simulatorStateChanged.subscribe((message) => {
         simulatorState = message as SimulatorState;
       });

       const evaluateDecisionPoint = function () {
         try {
           mockedSimulatorEngineService.evaluateDecisionPoint(decisionPoint, branchingLevel, undefined);
         } catch (error) {
           throw error;
         }
       };

       // evaluateDecisionPoint method should not throw as template is not intialized
       expect(evaluateDecisionPoint).not.toThrow();

       // Checks the data element values
       const elementValues = mockedSimulatorEngineService.getAllDataElementValues();

       expect(elementValues).toBeDefined();
       expect(elementValues).toBeTruthy();
       expect(elementValues['conditionConst']).toBeDefined();
       expect(elementValues['conditionConst']).toEqual('10');
       expect(elementValues['levelsinvolved']).toBeUndefined();
       expect(elementValues['singlemultiple']).toBeUndefined();
       expect(elementValues['sizeoflargestcluster']).toBeUndefined();
       expect(elementValues['significantAdditionalFindings']).toBeUndefined();

       // Checks the data element texts
       const elementTexts = mockedSimulatorEngineService.getAllDataElementTexts();

       expect(elementTexts).toBeDefined();
       expect(elementTexts).toBeTruthy();
       expect(elementTexts['conditionConst']).toBeUndefined();
       expect(elementTexts['levelsinvolved']).toBeUndefined();
       expect(elementTexts['singlemultiple']).toBeUndefined();
       expect(elementTexts['sizeoflargestcluster']).toBeUndefined();
       expect(elementTexts['significantAdditionalFindings']).toBeUndefined();

       // Checks the simulator content state
       expect(simulatorState).toBeDefined();
       expect(simulatorState.endPointId).toBeDefined();
       expect(simulatorState.endPointId).toEqual(template.rules.decisionPoints[0].branches[0].endPointRef.endPointId);
       expect(simulatorState.nonRelevantDataElementIds).toBeDefined();
       expect(simulatorState.selectedBranchLabel).toBeUndefined();
       expect(simulatorState.selectedDecisionPointId).toBeDefined();
       expect(simulatorState.selectedDecisionPointId).toEqual(template.rules.decisionPoints[0].id);
       expect(simulatorState.selectedDecisionPointLabel).toBeDefined();
       expect(simulatorState.selectedDecisionPointLabel).toEqual(template.rules.decisionPoints[0].label);

       // evaluateComputedElementDecisionPoint method called again to end point reached condition
       expect(evaluateDecisionPoint).not.toThrow();

       // Checks the simulator content state
       expect(simulatorState).toBeDefined();
       expect(simulatorState.endPointId).toBeDefined();
       expect(simulatorState.endPointId).toEqual(template.rules.decisionPoints[0].branches[0].endPointRef.endPointId);
       expect(simulatorState.nonRelevantDataElementIds).toBeDefined();
       expect(simulatorState.selectedBranchLabel).toBeUndefined();
       expect(simulatorState.selectedDecisionPointId).toBeDefined();
       expect(simulatorState.selectedDecisionPointId).toEqual(template.rules.decisionPoints[0].id);
       expect(simulatorState.selectedDecisionPointLabel).toBeDefined();
       expect(simulatorState.selectedDecisionPointLabel).toEqual(template.rules.decisionPoints[0].label);
    });

    it('Called evaluateComputedElementDecisionPoint(elementId: string , decisionPoint: DecisionPoint,  branchingLevel)' +
       'by initializing the template and endOfRoadReached true', () => {
         setTemplateData();
         initialiseEngineService();

         const decisionPoint = (<ComputedDataElement>template.dataElements.find(x => x.dataElementType === 'ComputedDataElement')).decisionPoints[0];
         const branchingLevel = '1';
         const elementId = template.dataElements.find(x => x.dataElementType === 'ComputedDataElement').id;

         const evaluateComputedElementDecisionPoint = function () {
           try {
             mockedSimulatorEngineService.evaluateComputedElementDecisionPoint(elementId, decisionPoint, branchingLevel);
           } catch (error) {
             throw error;
           }
         };

         // evaluateComputedElementDecisionPoint method should not throw as template is not intialized
         expect(evaluateComputedElementDecisionPoint).not.toThrow();

         // Checks the data element values
         const elementValues = mockedSimulatorEngineService.getAllDataElementValues();

         expect(elementValues).toBeDefined();
         expect(elementValues).toBeTruthy();
         expect(elementValues['conditionConst']).toBeDefined();
         expect(elementValues['conditionConst']).toEqual('10');
         expect(elementValues['levelsinvolved']).toBeUndefined();
         expect(elementValues['singlemultiple']).toBeUndefined();
         expect(elementValues['sizeoflargestcluster']).toBeUndefined();
         expect(elementValues['significantAdditionalFindings']).toBeUndefined();

         // Checks the data element texts
         const elementTexts = mockedSimulatorEngineService.getAllDataElementTexts();

         expect(elementTexts).toBeDefined();
         expect(elementTexts).toBeTruthy();
         expect(elementTexts['conditionConst']).toBeUndefined();
         expect(elementTexts['levelsinvolved']).toBeUndefined();
         expect(elementTexts['singlemultiple']).toBeUndefined();
         expect(elementTexts['sizeoflargestcluster']).toBeUndefined();
         expect(elementTexts['significantAdditionalFindings']).toBeUndefined();

         // evaluateComputedElementDecisionPoint method called again to end point reached condition
         expect(evaluateComputedElementDecisionPoint).not.toThrow();
   });

   it('Called evaluateDecisionPoint(decisionPoint: DecisionPoint,  branchingLevel, nonRelevantDataElementIds: string[] = [])' +
     'by initializing the template and passing empty dataelement values', () => {
       setTemplateData();
       initialiseEngineService();

       const decisionPoint = template.rules.decisionPoints[0];
       const branchingLevel = '0';
       const nonRelevantDataElementIds = undefined;
       template.rules.decisionPoints[0].branches[0].condition.conditionType.comparisonValue = 11;

       mockedSimulatorEngineService.simulatorStateChanged.subscribe((message) => {
         simulatorState = message as SimulatorState;
       });

       const evaluateDecisionPoint = function () {
         try {
           mockedSimulatorEngineService.evaluateDecisionPoint(decisionPoint, branchingLevel, undefined);
         } catch (error) {
           throw error;
         }
       };

       // evaluateDecisionPoint method should not throw as template is not intialized
       expect(evaluateDecisionPoint).not.toThrow();

       // Checks the data element values
       const elementValues = mockedSimulatorEngineService.getAllDataElementValues();

       expect(elementValues).toBeDefined();
       expect(elementValues).toBeTruthy();
       expect(elementValues['conditionConst']).toBeDefined();
       expect(elementValues['conditionConst']).toEqual('10');
       expect(elementValues['levelsinvolved']).toBeUndefined();
       expect(elementValues['singlemultiple']).toBeUndefined();
       expect(elementValues['sizeoflargestcluster']).toBeUndefined();
       expect(elementValues['significantAdditionalFindings']).toBeUndefined();

       // Checks the data element texts
       const elementTexts = mockedSimulatorEngineService.getAllDataElementTexts();

       expect(elementTexts).toBeDefined();
       expect(elementTexts).toBeTruthy();
       expect(elementTexts['conditionConst']).toBeUndefined();
       expect(elementTexts['levelsinvolved']).toBeUndefined();
       expect(elementTexts['singlemultiple']).toBeUndefined();
       expect(elementTexts['sizeoflargestcluster']).toBeUndefined();
       expect(elementTexts['significantAdditionalFindings']).toBeUndefined();

       // Checks the simulator content state
       expect(simulatorState).toBeDefined();
       expect(simulatorState.endPointId).toBeDefined();
       expect(simulatorState.endPointId).toBeFalsy();
       expect(simulatorState.selectedBranchLabel).toBeDefined();
       expect(simulatorState.selectedBranchLabel).toBeFalsy();
       expect(simulatorState.selectedDecisionPointId).toBeDefined();
       expect(simulatorState.selectedDecisionPointId).toBeFalsy();
       expect(simulatorState.selectedDecisionPointLabel).toBeDefined();
       expect(simulatorState.selectedDecisionPointLabel).toBeFalsy();
    });

});
