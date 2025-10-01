import { DomainEvent } from "./domain-event.base";


export class RegisterTenant extends DomainEvent {
  constructor(
    notifiedUserId: string[],
    correlationId?: string
  ) {
    super(notifiedUserId,correlationId);
  }
    
    getType(): string {
      return 'RegisterTenant';
    }
  }
  