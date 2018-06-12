import { TestBed, inject } from '@angular/core/testing';

import { TemplateManagerService } from './template-manager.service';
import { ArrayCheckerService } from './array-checker.service';
import { DecisionPointsCreationService } from './decision-points-creation.service';
import { DiagramService } from './diagram.service';
import { ChoiceDataElementCreationService } from './choice-data-element-creation.service';
import { MultipleChoiceDataElementCreationService } from './multiple-choice-data-element-creation.service';
import { NumericDataElementCreationService } from './numeric-data-element-creation.service';
import { CreationServiceInjectorToken } from '../../constants';
import { IntegerDataElementCreationService } from './integer-data-element-creation.service';
import { GlobalValueCreationService } from './global-value-creation.service';
import { ComputedDataElementCreationService } from './computed-data-element-creation.service';
import { ComputedValueCreationService } from './computed-value-creation.service';
import { ConditionsCreationService } from './conditions-creation.service';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { IntegerDataElement } from '../../../core/elements/models/integer-data-element.model';
import { GlobalValue } from '../../../core/elements/models/globalvalue.model';
import { Template } from '../../../core/models/template.model';

class MockTemplateManagerService extends TemplateManagerService {
}

describe('TemplateService', () => {
  let mockedTemplateManagerService: TemplateManagerService;
  let template: Template;
  let xmlContent: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TemplateManagerService, useClass: MockTemplateManagerService }, ArrayCheckerService,
                    DecisionPointsCreationService, DiagramService,
                    ComputedValueCreationService, ConditionsCreationService,
                    {provide: CreationServiceInjectorToken, useClass: ChoiceDataElementCreationService, multi: true },
                    {provide: CreationServiceInjectorToken, useClass: MultipleChoiceDataElementCreationService, multi: true },
                    {provide: CreationServiceInjectorToken, useClass: NumericDataElementCreationService, multi: true },
                    {provide: CreationServiceInjectorToken, useClass: IntegerDataElementCreationService, multi: true },
                    {provide: CreationServiceInjectorToken, useClass: GlobalValueCreationService, multi: true },
                    {provide: CreationServiceInjectorToken, useClass: ComputedDataElementCreationService, multi: true }]
    });
    mockedTemplateManagerService = TestBed.get(TemplateManagerService);
  });

  afterEach(() => {
    mockedTemplateManagerService = undefined;
    template = undefined;
    xmlContent = '';
  });

  function setXmlContent() {
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
  }

  it('should be created', inject([TemplateManagerService], (service: TemplateManagerService) => {
    expect(service).toBeTruthy();
  }));

  it('Created same instance type of Mocked Service and Original Service', () => {
    expect(mockedTemplateManagerService instanceof TemplateManagerService).toBeTruthy();
  });

  it('Called getTemplate() method to get the template content with valid xml', () => {
    setXmlContent();

    const getTemplate = function () {
      try {
        template = mockedTemplateManagerService.getTemplate(xmlContent);
      } catch (error) {
        throw error;
      }
    };

    expect(getTemplate).not.toThrow();

    // Checks the template
    expect(template).toBeDefined();
    expect(template).toBeTruthy();

    // Checks the data elements
    expect(template.dataElements).toBeDefined();
    expect(template.dataElements).toBeTruthy();

    template.dataElements.forEach(element => {

      // Checks if data element is of choice element type
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
    expect(template.endPointsString).toBeDefined();
    expect(template.endPointsString).toBeTruthy();

    // Checks the metadata
    expect(template.metadata).toBeDefined();
    expect(template.metadata).toBeTruthy();
    expect(template.metadata.id).toBeDefined();
    expect(template.metadata.id).toBeTruthy();
    expect(template.metadata.label).toBeDefined();
    expect(template.metadata.label).toBeTruthy();
    expect(template.metadata.schemaVersion).toBeDefined();
    expect(template.metadata.schemaVersion).toBeTruthy();

    // Checks the diagrams
    expect(template.metadata.diagrams).toBeDefined();
    expect(template.metadata.diagrams).toBeTruthy();

    template.metadata.diagrams.forEach(element => {
      expect(element.label).toBeDefined();
      expect(element.label).toBeTruthy();
      expect(element.location).toBeDefined();
      expect(element.location).toBeTruthy();
      expect(element.displaySequence).toBeDefined();
      expect(element.displaySequence).toBeTruthy();
      expect(element.keyDiagram).toBeDefined();
    });

    // Checks the rules
    expect(template.rules).toBeDefined();
    expect(template.rules).toBeTruthy();

    // Checks the decision points
    expect(template.rules.decisionPoints).toBeDefined();
    expect(template.rules.decisionPoints).toBeTruthy();

    template.rules.decisionPoints.forEach(element => {
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

    // Checks the template partial
    expect(template.templatePartial).toBeDefined();
    expect(template.templatePartial).toBeTruthy();

     // Checks the xml content inside template
     expect(template.xmlContent).toBeDefined();
     expect(template.xmlContent).toBeTruthy();
  });

  it('Called getTemplate() method to get the template content by passing empty xml', () => {
    const getTemplate = function () {
      try {
        template = mockedTemplateManagerService.getTemplate(xmlContent);
      } catch (error) {
        throw error;
      }
    };

    expect(getTemplate).toThrow();
  });

  it('Called getTemplate() method to get the template content by passing invalid xml', () => {
    const getTemplate = function () {
      try {
        template = mockedTemplateManagerService.getTemplate(xmlContent);
      } catch (error) {
        throw error;
      }
    };

    expect(getTemplate).toThrow();
  });
});
