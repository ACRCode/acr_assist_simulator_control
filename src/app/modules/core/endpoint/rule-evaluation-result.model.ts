export class RuleEvaluationResult {
    endpoindId: string;
    repeatedSectionName: string;
    ruleEvaluationReportResult: RuleEvaluationReportResult;
    constructor() {
        this.ruleEvaluationReportResult = new RuleEvaluationReportResult();
    }
}

export class RuleEvaluationReportResult {
    reportText: string;
    sectionId: string;
}
