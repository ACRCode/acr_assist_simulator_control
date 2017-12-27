import { Diagram } from '../../shared/models/diagram.model';

export class Metadata {
  label: string;
  id: string;
  schemaVersion: string;
  ruleVersion: string;
  diagrams: Diagram[];
 }
