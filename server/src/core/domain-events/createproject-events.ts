import { DomainEvent } from "./domain-event.base";


export class CreateProjectEvent extends DomainEvent {
    constructor(
      notifiedUserId: string[],
      correlationId?: string
    ) {
      super(notifiedUserId,correlationId);
    }
    
    getType(): string {
      return 'CreateProject';
    }
  }
  