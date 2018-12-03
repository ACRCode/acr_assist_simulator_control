import { Diagram } from '../../models/diagram.model';

export class Metadata {
  label: string;
  id: string;
  schemaVersion: string;
  ruleVersion: string;
  diagrams: Diagram[];
  createdDate: Date;
  lastModifiedDate: Date;
  approvedBy: string;
  reviewedBy: string;
  developedBy: string;
  radElementSetID: string;
 }
