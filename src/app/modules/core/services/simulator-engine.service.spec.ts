import { TestBed, inject } from '@angular/core/testing';

import { SimulatorEngineService } from './simulator-engine.service';

describe('SimulatorEngineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulatorEngineService]
    });
  });

  it('should be created', inject([SimulatorEngineService], (service: SimulatorEngineService) => {
    expect(service).toBeTruthy();
  }));
});
