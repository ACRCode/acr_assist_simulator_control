import { ReportText } from './report-text.model';

export class ReportSection {
  public Headding: string;

  public ReportTexts: ReportText[];

  public ReqDataElements: string[];

  constructor() {
      this.Headding = '';
      this.ReportTexts = [];
      this.ReqDataElements = [];
  }
}
