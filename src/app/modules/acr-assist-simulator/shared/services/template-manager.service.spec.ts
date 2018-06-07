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

describe('TemplateServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateManagerService, ArrayCheckerService, DecisionPointsCreationService, DiagramService,
        ComputedValueCreationService, ConditionsCreationService,
        {provide: CreationServiceInjectorToken, useClass: ChoiceDataElementCreationService, multi: true },
        {provide: CreationServiceInjectorToken, useClass: MultipleChoiceDataElementCreationService, multi: true },
        {provide: CreationServiceInjectorToken, useClass: NumericDataElementCreationService, multi: true },
        {provide: CreationServiceInjectorToken, useClass: IntegerDataElementCreationService, multi: true },
        {provide: CreationServiceInjectorToken, useClass: GlobalValueCreationService, multi: true },
        {provide: CreationServiceInjectorToken, useClass: ComputedDataElementCreationService, multi: true }]
    });
  });

  it('should be created', inject([TemplateManagerService], (service: TemplateManagerService) => {
    expect(service).toBeTruthy();
  }));
});
