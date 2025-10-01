import { BranchingLogic} from '../model/branching-logic.interface';
import { Condition } from '../model/condition.interface';

export class BranchEvaluator {
  private responses: Record<string, any>;

  constructor(responses: Record<string, any>) {
    this.responses = responses;
  }

  evaluate(logic: BranchingLogic): string | false {
    if (!logic.conditions || logic.conditions.length === 0) { 

      return false; 

  }
  const result = this.evaluateLogic(logic);
if (result) {
  for (const child of logic.conditions) {
    if ('next' in child && this.evaluateCondition(child)) {
      return Array.isArray(child.next) ? child.next[0] : child.next;
    }
  }
  return logic.next || false;
}
  return false;
}


  private evaluateLogic(logic: BranchingLogic): boolean {
    switch (logic.operation) {
      case 'AND':
        return logic.conditions.every((c) => this.evaluateCondition(c));
      case 'OR':
        return logic.conditions.some((c) => this.evaluateCondition(c));
      case 'NOT':
        return !this.evaluateCondition(logic.conditions[0]);
      default:
        return false;
    }
  }

  private evaluateCondition(condition: BranchingLogic | Condition): boolean {
    if ('operation' in condition) {
      return this.evaluateLogic(condition);
    }

    const responseValue = this.responses[condition.questionId];

    if (Array.isArray(responseValue)) {
      return this.evaluateArrayCondition(responseValue, condition);
    }

    if (this.isDate(responseValue) || this.isDate(condition.value)) {
      return this.evaluateDateCondition(responseValue, condition);
    }

    return this.evaluateBasicCondition(responseValue, condition);
  } 

  private evaluateArrayCondition(response: any[], condition: Condition): boolean {
    switch (condition.operator) {
      case 'CONTAINS_ANY':
        return condition.value.some((val: any) => response.includes(val));

      case 'CONTAINS_ALL':
        return condition.value.every((val: any) => response.includes(val));

      case 'EQUALS':
        if (Array.isArray(condition.value)) {
          return (
            response.length === condition.value.length &&
            condition.value.every((val) => response.includes(val))
          );
        }
        return response.length === 1 && response[0] === condition.value;
      case 'NOT_EQUALS':
        return !response.includes(condition.value);
      default:
        return false;
    }
  }

  private evaluateDateCondition(response: any, condition: Condition): boolean {
    const responseDate = new Date(response);
    const conditionDate = new Date(condition.value);

    switch (condition.operator) {
      case 'EQUALS':
        return responseDate.getTime() === conditionDate.getTime();
      case 'NOT_EQUALS':
        return responseDate.getTime() !== conditionDate.getTime();
      case 'GREATER_THAN':
        return responseDate.getTime() > conditionDate.getTime();
      case 'LESS_THAN':
        return responseDate.getTime() < conditionDate.getTime();
      default:
        return false;
    }
  }

  private evaluateBasicCondition(response: any, condition: Condition): boolean {
    console.log('Evaluating:', { response, operator: condition.operator, value: condition.value });
    console.log('TYPE:', typeof response, typeof condition.value);
    switch (condition.operator) {
      case 'EQUALS':
        return response === condition.value;
      case 'NOT_EQUALS':
        return response !== condition.value;
      case 'GREATER_THAN':
        return response > condition.value;
      case 'LESS_THAN':
        return response < condition.value;
      case 'CONTAINS_ANY':
        return Array.isArray(condition.value) && condition.value.includes(response);
      case 'CONTAINS_ALL':
        return Array.isArray(condition.value) && Array.isArray(response) &&
          condition.value.every((val) => response.includes(val));
      default:
        return false;
    }
  }

  private isDate(value: any): boolean {
    return !isNaN(Date.parse(value));
  }
}
