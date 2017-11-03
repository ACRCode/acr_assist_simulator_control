export class ReportText {
  public Condition: string;

  public ResultText: string;

  public DataElementID: string;

  public NestedReportText: ReportText[];

  constructor() {
      this.Condition = '';
      this.ResultText = '';
      this.DataElementID = '';
      this.NestedReportText = [];
  }
}
