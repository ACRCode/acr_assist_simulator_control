import { ReportText } from './report-text.model';

export class ReportSection {
  public Heading: string;

  public ReportTexts: ReportText[];

  public ReqDataElements: string[];

  constructor() {
      this.Heading = '';
      this.ReportTexts = [];
      this.ReqDataElements = [];
  }
}
