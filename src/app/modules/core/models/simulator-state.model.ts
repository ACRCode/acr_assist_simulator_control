import { MainReportText } from 'testruleengine/Library/Models/Class';

export class SimulatorState {
  nonRelevantDataElementIds: string[] = [];
  endPointId = '';
  selectedDecisionPointId = '';
  selectedDecisionPointLabel = '';
  selectedBranchLabel = '';
  endPointIds: string[] = [];
  mainReportText: MainReportText[];
  showKeyDiagram: string;
}
