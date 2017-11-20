import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistSimulatorComponent } from './assist-simulator.component';
import { ComputedElementComponent } from '../computed-element/computed-element.component';
import { HintDiagramComponent } from '../hint-diagram/hint-diagram.component';
import { ImageMapComponent } from '../image-map/image-map.component';
import { DataElementComponent } from '../data-element/data-element.component';
import { ValueBlockComponent } from '../value-block/value-block.component';
import { ExpressionResultComponent } from '../expression-result/expression-result.component';
import { ExpresssionBlockComponent } from '../expresssion-block/expresssion-block.component';
import { ReportTextComponent } from '../report-text/report-text.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StringUtilityService } from '../shared/services/string-utility.service';
import { SettingsService } from '../shared/services/settings.service';
import { GlobalsService } from '../shared/services/globals.service';

describe('AssistSimulatorComponent', () => {
  let component: AssistSimulatorComponent;
  let fixture: ComponentFixture<AssistSimulatorComponent>;
  const sampleTemplate = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-model href="../../XML Schema/ACRAssist_xml_schema.rnc" type="application/relax-ng-compact-syntax"?>
  <ReportingModule>
      <Metadata>
          <Label>Adrenal CT</Label>
          <ID>ACR_Adrenal_CT_2_0</ID>
          <SchemaVersion>1.0</SchemaVersion>
          <RuleVersion>2.0</RuleVersion>
          <Info>
              <Description></Description>
              <References>
                  <Citation></Citation>
              </References>
              <Diagrams>
                  <Diagram DisplaySequence="1" KeyDiagram="true">
                      <Location>keyimage.PNG</Location>
                      <Label>Adrenal CT</Label>
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
              <AnatomicRegions>
                  <Region Code=""></Region>
              </AnatomicRegions>
              <PossibleDiagnoses>
                  <Diagnosis Code=""></Diagnosis>
              </PossibleDiagnoses>
          </Ontology>
          <ApplicableExams>
              <ApplicableExamCategory Axis="Modality">
              </ApplicableExamCategory>
              <ApplicableExamCategory  Axis="Anatomy"/>

          </ApplicableExams>
          <ApplicableSexes Value="Both"></ApplicableSexes>
          <ApplicableAgeGroups>
              <MinimumAge>19</MinimumAge>
          </ApplicableAgeGroups>
          <TextCues>
              <ContextPhrases>
                  <ContextPhrase></ContextPhrase>
              </ContextPhrases>
              <KeyWords>
                  <KeyWord></KeyWord>
              </KeyWords>
              <NegationPhrases>
                  <NegationPhrase></NegationPhrase>
              </NegationPhrases>
              <Regex/>

          </TextCues>
          <VoiceActivation>
              <VoiceCommandPhrase></VoiceCommandPhrase>
          </VoiceActivation>
      </Metadata>

      <DataElements>

          <GlobalValue Id="sizeone">1</GlobalValue>

          <GlobalValue Id="sizetwo">2</GlobalValue>

          <GlobalValue Id="sizefour">4</GlobalValue>


          <ChoiceDataElement Id="imgagefeatures" DisplaySequence="1" IsRequired="true">
              <Label>Incidental, Asymptomatic Adrenal Mass (≥1 cm) Detected on any CT or MR exam</Label>
              <ChoiceInfo>
                  <Choice>
                      <Value>Benign</Value>
                      <Label>Diagnostic Benign Imaging Features</Label>
                  </Choice>
                  <Choice>
                      <Value>Indeterminate</Value>
                      <Label>Indeterminate Imaging Features</Label>
                  </Choice>
              </ChoiceInfo>
          </ChoiceDataElement>


          <ChoiceDataElement Id="benignimgagefeatures" DisplaySequence="2" IsRequired="true">
              <Label>Diagnostic Benign Imaging Features</Label>
              <ChoiceInfo>
                  <Choice>
                      <Value>Myelolipoma</Value>
                      <Label>Myelolipoma, No enhancement, Ca++</Label>
                  </Choice>
                  <Choice>
                      <Value>lessthan10hu</Value>
                      <Label>≤10 HU or drop in signal on CS-MR</Label>
                  </Choice>
              </ChoiceInfo>
          </ChoiceDataElement>

          <NumericDataElement Id="size" IsRequired="true" DisplaySequence="3">
              <Label>Size (cm)</Label>
              <Hint>Size of the lesion in cm</Hint>
              <Minimum>1</Minimum>
          </NumericDataElement>

          <ChoiceDataElement Id="cancerhxfor4cm" IsRequired="true" DisplaySequence="4">
              <Label>Cancer Hx</Label>
              <ChoiceInfo>
                  <Choice>
                      <Value>no</Value>
                      <Label>No Cancer Hx</Label>
                  </Choice>
                  <Choice>
                      <Value>yes</Value>
                      <Label>Cancer Hx</Label>
                  </Choice>
              </ChoiceInfo>
          </ChoiceDataElement>

          <ChoiceDataElement Id="priorImagingfinding" IsRequired="true" DisplaySequence="5">
              <Label>Prior imaging</Label>
              <ChoiceInfo>
                  <Choice>
                      <Value>stableoneyear</Value>
                      <Label>Stable ≥ 1 year</Label>
                  </Choice>
                  <Choice>
                      <Value>Neworenlarging</Value>
                      <Label>New or enlarging</Label>
                  </Choice>
                  <Choice>
                      <Value>Nopriorimaging</Value>
                      <Label>No prior imaging, No Cancer Hx</Label>
                  </Choice>
                  <Choice>
                      <Value>AdrenalCT</Value>
                      <Label>No prior imaging, Cancer Hx and isolated adrenal mass</Label>
                  </Choice>
              </ChoiceInfo>
          </ChoiceDataElement>

          <ChoiceDataElement Id="cancerhxpriorimaging" IsRequired="true" DisplaySequence="6">
              <Label>Cancer Hx prior imaging</Label>
              <ChoiceInfo>
                  <Choice>
                      <Value>no</Value>
                      <Label>No Cancer Hx</Label>
                  </Choice>
                  <Choice>
                      <Value>yes</Value>
                      <Label>Cancer Hx</Label>
                  </Choice>
              </ChoiceInfo>
          </ChoiceDataElement>

          <ChoiceDataElement Id="huonncct" IsRequired="true" DisplaySequence="7">
              <Label>HU on NCCT</Label>
              <ChoiceInfo>
                  <Choice>
                      <Value>lessthanorequalto10</Value>
                      <Label>NCCT ≤10 HU</Label>
                  </Choice>
                  <Choice>
                      <Value>greaterthan10</Value>
                      <Label>NCCT >10 HU</Label>
                  </Choice>
              </ChoiceInfo>
          </ChoiceDataElement>

          <ChoiceDataElement Id="AdrenalCTwashout" IsRequired="true" DisplaySequence="8">
              <Label>Adrenal CT washout</Label>
              <ChoiceInfo>
                  <Choice>
                      <Value>noenhancement</Value>
                      <Label>No enhancement (&lt;10HU) = cyst or hemorrhage</Label>
                  </Choice>
                  <Choice>
                      <Value>APWRPWgreater60</Value>
                      <Label>APW/RPW ≥60/40%</Label>
                  </Choice>
                  <Choice>
                      <Value>APWRPWlessthan60</Value>
                      <Label>APW/RPW &lt;60/40%</Label>
                  </Choice>
              </ChoiceInfo>
          </ChoiceDataElement>

      </DataElements>

      <Rules>
          <DecisionPoint Id="adrenalmassDp">
              <Label>Incidental, Asymptomatic Adrenal Mass (≥1 cm) Detected on any CT or MR exam</Label>
              <Branch>
                  <NotRelevantDataElements>
                      <DataElementRef DataElementId="cancerhxfor4cm"/>
                      <DataElementRef DataElementId="AdrenalCTwashout"/>
                      <DataElementRef DataElementId="priorImagingfinding"/>
                      <DataElementRef DataElementId="size"/>
                      <DataElementRef DataElementId="huonncct"/>
                      <DataElementRef DataElementId="cancerhxpriorimaging"/>
                  </NotRelevantDataElements>
                  <EqualCondition DataElementId="imgagefeatures" ComparisonValue="Benign"/>

                  <DecisionPoint Id="benignfeaturesSp">
                  <Label>Diagnostic Benign Imaging Features</Label>
                  <Branch>
                      <EqualCondition DataElementId="benignimgagefeatures" ComparisonValue="Myelolipoma"/>
                      <EndPointRef EndPointId="BenignnofuEp"></EndPointRef>
                  </Branch>
                  <Branch>
                      <EqualCondition DataElementId="benignimgagefeatures" ComparisonValue="lessthan10hu"/>
                      <EndPointRef EndPointId="BenignAdenomaEp"></EndPointRef>
                  </Branch>
                  </DecisionPoint>
              </Branch>

              <Branch>
                  <NotRelevantDataElements>
                      <DataElementRef DataElementId="benignimgagefeatures"></DataElementRef>
                  </NotRelevantDataElements>
                  <EqualCondition DataElementId="imgagefeatures" ComparisonValue="Indeterminate"/>
                  <DecisionPoint Id="masssizeDp">
                      <Label>Mass Size(cm)</Label>
                      <Branch>
                          <NotRelevantDataElements>
                              <DataElementRef DataElementId="AdrenalCTwashout"/>
                              <DataElementRef DataElementId="priorImagingfinding"/>
                              <DataElementRef DataElementId="huonncct"/>
                              <DataElementRef DataElementId="cancerhxpriorimaging"/>
                          </NotRelevantDataElements>
                          <GreaterThanOrEqualsCondition DataElementId="size" ComparisonValue="sizefour"/>
                          <DecisionPoint Id="cancerhxfor4cmDp1">
                              <Label>Cancer Hx</Label>
                              <Branch>
                                  <EqualCondition DataElementId="cancerhxfor4cm" ComparisonValue="no"/>
                                  <EndPointRef EndPointId="nocancerhxfor4cmEp"></EndPointRef>
                              </Branch>
                              <Branch>
                                  <EqualCondition DataElementId="cancerhxfor4cm" ComparisonValue="yes"/>
                                  <EndPointRef EndPointId="cancerhxfor4cmEp"></EndPointRef>
                              </Branch>
                          </DecisionPoint>
                      </Branch>
                      <Branch>
                          <Label>1-4cm</Label>
                          <NotRelevantDataElements>
                              <DataElementRef DataElementId="cancerhxfor4cm"/>
                          </NotRelevantDataElements>
                          <AndCondition>
                              <GreaterThanOrEqualsCondition DataElementId="size" ComparisonValue="sizeone"/>
                              <LessThanCondition DataElementId="size" ComparisonValue="sizefour"/>
                          </AndCondition>
                          <DecisionPoint Id="PiorImagingConditionDp">
                              <Label>PiorImagingCondition</Label>
                              <Branch>
                                  <Label>Stable ≥ 1 year</Label>
                                  <NotRelevantDataElements>
                                      <DataElementRef DataElementId="cancerhxpriorimaging"/>
                                      <DataElementRef DataElementId="AdrenalCTwashout"/>
                                      <DataElementRef DataElementId="huonncct"/>
                                  </NotRelevantDataElements>
                                  <EqualCondition DataElementId="priorImagingfinding" ComparisonValue="stableoneyear"/>
                                  <EndPointRef EndPointId="BenignnofuEp"></EndPointRef>
                              </Branch>
                              <Branch>
                                  <Label>New or enlarging</Label>
                                  <NotRelevantDataElements>
                                      <DataElementRef DataElementId="AdrenalCTwashout"/>
                                      <DataElementRef DataElementId="huonncct"/>
                                  </NotRelevantDataElements>
                                  <EqualCondition DataElementId="priorImagingfinding" ComparisonValue="Neworenlarging"/>
                                  <DecisionPoint Id="cancerhxfor4cmDp2">
                                      <Label>Cancer Hx</Label>
                                      <Branch>
                                          <EqualCondition DataElementId="cancerhxpriorimaging" ComparisonValue="no"/>
                                          <EndPointRef EndPointId="newOrEnlargingNoCancerhxEp"></EndPointRef>
                                      </Branch>
                                      <Branch>
                                          <EqualCondition DataElementId="cancerhxpriorimaging" ComparisonValue="yes"/>
                                          <EndPointRef EndPointId="newOrEnlargingCancerhxEp"></EndPointRef>
                                      </Branch>
                                  </DecisionPoint>
                              </Branch>
                              <Branch>
                                  <Label>No prior imaging/ No Cancer Hx</Label>
                                  <NotRelevantDataElements>
                                      <DataElementRef DataElementId="cancerhxpriorimaging"/>
                                  </NotRelevantDataElements>
                                  <EqualCondition DataElementId="priorImagingfinding" ComparisonValue="Nopriorimaging"/>
                                  <DecisionPoint Id="masssizeDp2">
                                      <Label>mass size for No prior imaging/No Cancer Hx</Label>
                                      <Branch>
                                          <Label>Size 1-2cm</Label>
                                          <NotRelevantDataElements>
                                              <DataElementRef DataElementId="AdrenalCTwashout"/>
                                              <DataElementRef DataElementId="huonncct"/>
                                              <DataElementRef DataElementId="cancerhxpriorimaging"/>
                                          </NotRelevantDataElements>
                                          <AndCondition>
                                              <GreaterThanOrEqualsCondition DataElementId="size" ComparisonValue="sizeone"/>
                                              <LessThanOrEqualsCondition DataElementId="size" ComparisonValue="sizetwo"/>
                                          </AndCondition>
                                          <EndPointRef EndPointId="probablybenignEp"></EndPointRef>
                                      </Branch>
                                      <Branch>
                                          <Label>2-4cm</Label>

                                          <AndCondition>
                                              <GreaterThanCondition DataElementId="size" ComparisonValue="sizetwo"/>
                                              <LessThanCondition DataElementId="size" ComparisonValue="sizefour"/>
                                          </AndCondition>
                                          <DecisionPoint Id="huonNcctDp">
                                              <Label>HU on NCCT</Label>
                                              <Branch>
                                                  <Label>HU lessthan or equalto 10 </Label>
                                                  <NotRelevantDataElements>
                                                      <DataElementRef DataElementId="AdrenalCTwashout"/>

                                                  </NotRelevantDataElements>
                                                  <EqualCondition DataElementId="huonncct" ComparisonValue="lessthanorequalto10"/>
                                                  <EndPointRef EndPointId="BenignAdenomaEp"></EndPointRef>
                                              </Branch>
                                              <Branch>
                                                  <Label>HU greater than 10 </Label>
                                                  <EqualCondition DataElementId="huonncct" ComparisonValue="greaterthan10"/>
                                                  <DecisionPoint Id="ctwashoutDp">
                                                      <Label> Adrenal CT washout </Label>
                                                      <Branch>
                                                          <Label></Label>
                                                          <EqualCondition DataElementId="AdrenalCTwashout" ComparisonValue="noenhancement"/>
                                                          <EndPointRef EndPointId="BenignnofuEp"></EndPointRef>
                                                      </Branch>
                                                      <Branch>
                                                          <Label></Label>
                                                          <EqualCondition DataElementId="AdrenalCTwashout" ComparisonValue="APWRPWgreater60"/>
                                                          <EndPointRef EndPointId="BenignAdenomaEp"></EndPointRef>
                                                      </Branch>
                                                      <Branch>
                                                          <Label></Label>
                                                          <EqualCondition DataElementId="AdrenalCTwashout" ComparisonValue="APWRPWlessthan60"/>
                                                          <EndPointRef EndPointId="ImagingfuEp"></EndPointRef>
                                                      </Branch>
                                                  </DecisionPoint>
                                              </Branch>
                                          </DecisionPoint>
                                      </Branch>
                                  </DecisionPoint>
                              </Branch>
                              <Branch>
                                  <Label>No prior imaging, + Cancer Hx and isolated adrenal mass</Label>
                                  <NotRelevantDataElements>
                                      <DataElementRef DataElementId="cancerhxpriorimaging"/>
                                  </NotRelevantDataElements>
                                  <EqualCondition DataElementId="priorImagingfinding" ComparisonValue="AdrenalCT"/>
                                  <DecisionPoint Id="huonncctDp2">
                                      <Label>HU on NCCT</Label>
                                      <Branch>
                                          <Label>HU lessthan or equalto 10 </Label>
                                          <NotRelevantDataElements>
                                              <DataElementRef DataElementId="AdrenalCTwashout"/>
                                          </NotRelevantDataElements>
                                          <EqualCondition DataElementId="huonncct" ComparisonValue="lessthanorequalto10"/>
                                          <EndPointRef EndPointId="BenignAdenomaEp"></EndPointRef>
                                      </Branch>
                                      <Branch>
                                          <Label>HU greater than 10 </Label>
                                          <EqualCondition DataElementId="huonncct" ComparisonValue="greaterthan10"/>
                                          <DecisionPoint Id="adrenalctwashoutDp2">
                                              <Label> Adrenal CT washout </Label>
                                              <Branch>
                                                  <Label></Label>
                                                  <EqualCondition DataElementId="AdrenalCTwashout" ComparisonValue="noenhancement"/>
                                                  <EndPointRef EndPointId="BenignnofuEp"></EndPointRef>
                                              </Branch>
                                              <Branch>
                                                  <Label></Label>
                                                  <EqualCondition DataElementId="AdrenalCTwashout" ComparisonValue="APWRPWgreater60"/>
                                                  <EndPointRef EndPointId="BenignAdenomaEp"></EndPointRef>
                                              </Branch>
                                              <Branch>
                                                  <Label></Label>
                                                  <EqualCondition DataElementId="AdrenalCTwashout" ComparisonValue="APWRPWlessthan60"/>
                                                  <EndPointRef EndPointId="ImagingfuEp"></EndPointRef>
                                              </Branch>
                                          </DecisionPoint>
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

          <EndPoint Id="BenignnofuEp">
              <Label>Adenoma on CT</Label>
              <ReportTexts>
                  <ReportText SectionId="findings">Benign, no F/U</ReportText>
              </ReportTexts>
          </EndPoint>

          <EndPoint Id="BenignAdenomaEp">
              <Label>Adenoma on CT</Label>
              <ReportTexts>
                  <ReportText SectionId="findings">Benign adenoma, no F/U</ReportText>
              </ReportTexts>
          </EndPoint>

          <EndPoint Id="nocancerhxfor4cmEp">
              <Label>No Cancer Hx</Label>
              <ReportTexts>
                  <ReportText SectionId="findings">Consider resection</ReportText>
              </ReportTexts>
          </EndPoint>


          <EndPoint Id="newOrEnlargingCancerhxEp">
              <Label>No Cancer Hx</Label>
              <ReportTexts>
                  <ReportText SectionId="findings">Consider Bx or PET-CT</ReportText>
              </ReportTexts>
          </EndPoint>

          <EndPoint Id="newOrEnlargingNoCancerhxEp">
              <Label>No Cancer Hx</Label>
              <ReportTexts>
                  <ReportText SectionId="findings">Consider 12 month F/U adrenal CT or resection</ReportText>
              </ReportTexts>
          </EndPoint>



          <EndPoint Id="cancerhxfor4cmEp">
              <Label>Cancer Hx</Label>
              <ReportTexts>
                  <ReportText SectionId="findings">Consider Bx or PET-CT</ReportText>
              </ReportTexts>
          </EndPoint>

          <EndPoint Id="ImagingfuEp">
              <Label>Adenoma on CT</Label>
              <ReportTexts>
                  <ReportText SectionId="findings">Imaging F/U, Bx, PET-CT,or resection
                      depending on clinical scenario</ReportText>
              </ReportTexts>
          </EndPoint>

          <EndPoint Id="probablybenignEp">
              <Label>Adenoma on CT</Label>
              <ReportTexts>
                  <ReportText SectionId="findings">Probably benign Consider 12 month F/U adrenal CT</ReportText>
              </ReportTexts>
          </EndPoint>

      </EndPoints>

  </ReportingModule>`;

  const imagePath = '//XMLFiles//Samples';

  const components = [AssistSimulatorComponent, ComputedElementComponent, HintDiagramComponent,
    ImageMapComponent, DataElementComponent, ExpresssionBlockComponent,
    ValueBlockComponent, ExpressionResultComponent, ReportTextComponent];

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      imports: [
        CommonModule,
        FormsModule
      ],
      declarations : components,
      providers : [StringUtilityService , GlobalsService, SettingsService]
     })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistSimulatorComponent);
    component = fixture.componentInstance;
     fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should not be valid if the templateContent is undefined', () => {
    component.templateContent = undefined;
    component.imagePath = imagePath;
    component.ngOnInit();
    fixture.detectChanges();
    expect (component.isValid).toBe(false);
   });

  it('should not be valid if the image path is empty string', () => {
    component.templateContent = sampleTemplate;
    component.imagePath = '';
    component.ngOnInit();
    fixture.detectChanges();
    expect (component.isValid).toBe(false);
  });

  it('should not be valid if the image path  is undefined', () => {
    component.templateContent = sampleTemplate;
    component.imagePath = undefined;
    component.ngOnInit();
    fixture.detectChanges();
    expect (component.isValid).toBe(false);
  });




   it('should not be valid if the templateContent is empty string', () => {
      component.templateContent = '';
      component.imagePath = imagePath;
      component.ngOnInit();
      fixture.detectChanges();
      expect (component.isValid).toBe(false);
  });

  it('should  be valid if the image path and template  is non empty string', () => {
    component.templateContent = sampleTemplate;
    component.imagePath = imagePath;
    component.ngOnInit();
    fixture.detectChanges();
    expect (component.isValid).toBe(true);
  });

  it('should  be valid if the image path and template  is non empty string', () => {
    component.templateContent = sampleTemplate;
    component.imagePath = imagePath;
    component.ngOnInit();
    fixture.detectChanges();
    expect (component.isValid).toBe(true);
  });

  it('The template name should be marval ', () => {
    component.templateContent = sampleTemplate;
    component.imagePath = imagePath;
    component.ngOnInit();
    fixture.detectChanges();
    expect (component.isValid).toBe(true);
  });

});
