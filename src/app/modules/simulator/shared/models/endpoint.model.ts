import { ReportSection } from './report-section.model';

export class EndPoint {
  public ID: string;
  public ReportSections: ReportSection[];

  public ReqDataElements: string[];

  constructor() {
      this.ID = '';
      this.ReportSections = [];
      this.ReqDataElements = [];
  }
}
