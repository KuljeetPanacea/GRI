import { DomainEvent } from "./domain-event.base";


export class DocumentUploadedEvent extends DomainEvent {
    constructor(      // Recipient
      public readonly tenantId: string,
      public readonly documentId: string,
      public readonly documentName: string,
      public readonly auditId: string,
      public readonly auditName: string,
      public readonly uploadedBy: string,    // Actor
      public readonly uploadedByName: string,
      public readonly uploadedAt: Date,
      public readonly fileSize: number,
      public readonly fileType: string,
      public readonly userId: string[],
      correlationId?: string,
      
    ) {
      super(userId,correlationId);
    }
    
    getType(): string {
      return 'DocumentUploaded';
    }
  }
  