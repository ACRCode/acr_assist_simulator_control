import { Diagram } from '../../models/diagram.model';

export class Metadata {
  label: string;
  id: string;
  schemaVersion: string;
  ruleVersion: string;
  diagrams: Diagram[];
 }
