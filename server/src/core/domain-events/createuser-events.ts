import { DomainEvent } from "./domain-event.base";


export class CreateUserEvent extends DomainEvent {
  constructor(
    notifiedUserId: string[],
    correlationId?: string
  ) {
    super(notifiedUserId,correlationId);
  }
    
    getType(): string {
      return 'CreateUser';
    }
  }
  