export interface Condition {
    questionId: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS_ANY' | 'CONTAINS_ALL';
    value: any;
    next?: [string];
  }
  