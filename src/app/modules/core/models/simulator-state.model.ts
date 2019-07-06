import { RuleEvaluationResult } from "testruleengine/Library/RuleEvaluator";

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
