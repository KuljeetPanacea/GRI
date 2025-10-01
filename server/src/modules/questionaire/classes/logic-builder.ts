import { BranchingLogic } from '../model/branching-logic.interface';
import { Condition } from '../model/condition.interface';

export class LogicBuilder {
  private currentLogic: BranchingLogic;

  constructor(next: string) {
    this.currentLogic = { operation: 'AND', conditions: [], next };
  }

  addCondition(
    questionId: string,
    operator: Condition['operator'],
    value: any,
    conjunction: 'AND' | 'OR'
  ): void {
    const newCondition: Condition = { questionId, operator, value };

    if (!this.currentLogic.conditions || this.currentLogic.conditions.length === 0) {
      this.currentLogic.operation = conjunction;
      this.currentLogic.conditions = [newCondition];
    } else if (conjunction === 'AND') {
      if (this.currentLogic.operation === 'AND') {
        this.currentLogic.conditions.push(newCondition);
      } else {
        const andSubtree: BranchingLogic = {
          operation: 'AND',
          conditions: [newCondition],
        };
        this.currentLogic.conditions.push(andSubtree);
      }
    } else if (conjunction === 'OR') {
      this.currentLogic = {
        operation: 'OR',
        conditions: [this.currentLogic, newCondition],
        next: this.currentLogic.next,
      };
    }
  }

  addNotCondition(
    condition: BranchingLogic | Condition,
    conjunction: 'AND' | 'OR'
  ): void {
    const notLogic: BranchingLogic = {
      operation: 'NOT',
      conditions: [condition],
      next: this.currentLogic.next,
    };

    if (!this.currentLogic.conditions || this.currentLogic.conditions.length === 0) {
      this.currentLogic = notLogic;
    } else if (conjunction === 'AND') {
      if (this.currentLogic.operation === 'AND') {
        this.currentLogic.conditions.push(notLogic);
      } else {
        this.currentLogic = {
          operation: 'AND',
          conditions: [this.currentLogic, notLogic],
          next: this.currentLogic.next,
        };
      }
    } else if (conjunction === 'OR') {
      if (this.currentLogic.operation === 'OR') {
        this.currentLogic.conditions.push(notLogic);
      } else {
        this.currentLogic = {
          operation: 'OR',
          conditions: [this.currentLogic, notLogic],
          next: this.currentLogic.next,
        };
      }
    }
  }

  getLogic(): BranchingLogic {
    return this.currentLogic;
  }
}
