import { RuleEvaluationResult } from "testruleengine/Library/Models/Class";

export class SimulatorState {
  nonRelevantDataElementIds: string[] = [];
  endPointId = '';
  selectedDecisionPointId = '';
  selectedDecisionPointLabel = '';
  selectedBranchLabel = '';
  endPointIds: string[] = [];
  ruleEvaluationResults: RuleEvaluationResult[];
  showKeyDiagram: string;
}
