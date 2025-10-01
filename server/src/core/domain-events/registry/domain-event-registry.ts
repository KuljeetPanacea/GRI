export interface DomainEventRegistryEntry {
    eventType: string;
    category: string;
    description: string;
    processorTypes: string[];
    allowedChannels?: string[];  // For notification events
    defaultChannels?: string[];  // For notification events
    enabledByDefault?: boolean;  // For notification events
  }
  
  export const DomainEventRegistry: DomainEventRegistryEntry[] = [
    {
      eventType: 'DocumentUploaded',
      category: 'Documents',
      description: 'A new document was uploaded',
      processorTypes: ['notification', 'ai'],
      allowedChannels: ['EMAIL', 'IN_APP', 'WHATSAPP'],
      defaultChannels: ['EMAIL', 'IN_APP'],
      enabledByDefault: true,
    },
    {
      eventType: 'AuditMilestone',
      category: 'Audits',
      description: 'An audit milestone was reached',
      processorTypes: ['notification', 'audit-log'],
      allowedChannels: ['EMAIL', 'IN_APP', 'WHATSAPP'],
      defaultChannels: ['EMAIL', 'IN_APP'],
      enabledByDefault: true,
    },
    {
      eventType: 'FindingCreated',
      category: 'Findings',
      description: 'A new finding was created',
      processorTypes: ['notification', 'ai', 'audit-log'],
      allowedChannels: ['EMAIL', 'IN_APP', 'WHATSAPP'],
      defaultChannels: ['EMAIL', 'IN_APP'],
      enabledByDefault: true,
    },
    {
      eventType: 'CreateUser',
      category: 'User',
      description: 'A new User was created',
      processorTypes: ['notification'],
      allowedChannels: ['EMAIL'],
      defaultChannels: ['EMAIL'],
      enabledByDefault: true,
    },
    {
      eventType: 'CreateProject',
      category: 'Project',
      description: 'A new Project was created',
      processorTypes: ['notification'],
      allowedChannels: ['EMAIL'],
      defaultChannels: ['EMAIL'],
      enabledByDefault: true,
    },
    {
      eventType: 'AssignTask', 
      category: 'Tasks',
      description: 'A task was assigned to a user',
      processorTypes: ['notification'],  
      allowedChannels: ['EMAIL'], 
      defaultChannels: ['EMAIL'],  
      enabledByDefault: true,  
    },
    {
      eventType: 'AEPOCCreated', 
      category: 'Tasks',
      description: 'User created and Task assigned',
      processorTypes: ['notification'],  
      allowedChannels: ['EMAIL'], 
      defaultChannels: ['EMAIL'],  
      enabledByDefault: true,
    },
    {
      eventType: '',
      category: 'RegisterTenant',
      description: 'A new Tenant was created',
      processorTypes: ['notification'],
      allowedChannels: ['EMAIL'],
      defaultChannels: ['EMAIL'],
      enabledByDefault: true,
    },
    // Add more events as needed
  ];
  
  export function getProcessorsForEvent(eventType: string): string[] {
    return DomainEventRegistry.find(entry => entry.eventType === eventType)?.processorTypes || [];
  }
  
  export function getNotificationEventMetadata(): DomainEventRegistryEntry[] {
    return DomainEventRegistry.filter(entry => 
      entry.processorTypes.includes('notification')
    );
  }