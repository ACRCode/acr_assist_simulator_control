import { Branch } from './branch.model';

export class DecisionPoint {
  id: string;
  label: string;
  branches: Branch[];
}
