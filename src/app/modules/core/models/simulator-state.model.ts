import { RuleEvaluationResult } from "../endpoint/rule-evaluation-result.model";

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
