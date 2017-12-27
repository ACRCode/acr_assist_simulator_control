import { TestBed, inject } from '@angular/core/testing';

import { WorkflowEngineService } from './workflow-engine.service';

describe('WorkflowEngineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowEngineService]
    });
  });

  it('should be created', inject([WorkflowEngineService], (service: WorkflowEngineService) => {
    expect(service).toBeTruthy();
  }));
});
