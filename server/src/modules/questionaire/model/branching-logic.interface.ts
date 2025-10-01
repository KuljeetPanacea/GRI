import { Condition } from './condition.interface';

export interface BranchingLogic {
  operation: 'AND' | 'OR' | 'NOT' | '';
  conditions?: (BranchingLogic | Condition)[];
  next?: string;
}