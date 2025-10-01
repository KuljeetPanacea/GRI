import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent {
  public readonly correlationId: string;
  public readonly notifiedUserId: string[];
  
  constructor(notifiedUserId: string[],correlationId?: string) {
    this.correlationId = correlationId || uuidv4();
    this.notifiedUserId = notifiedUserId || [];
  }
  
  abstract getType(): string;
  
  toJSON(): Record<string, any> {
    return Object.getOwnPropertyNames(this)
      .filter(prop => prop !== 'constructor')
      .reduce((obj, key) => {
        obj[key] = this[key];
        return obj;
      }, {} as Record<string, any>);
  }
}