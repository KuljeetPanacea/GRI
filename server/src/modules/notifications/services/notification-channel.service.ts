export interface NotificationChannelService {
    send(
      notification: any,
      content: { subject?: string; title?: string; content: string },
      deliveryId: string
    ): Promise<string | null>;
  }