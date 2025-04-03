import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ClerkWebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async processClerkEvent(eventType: string, userData: any) {
    switch (eventType) {
      case 'user.created':
        await this.prisma.user.create({
          data: {
            id: userData.id,
            email: userData.email_addresses[0].email_address,
            name: userData.first_name + ' ' + userData.last_name,
            image: userData.image_url,
            externalId: userData.id,
          },
        });
        break;

      case 'user.updated':
        await this.prisma.user.update({
          where: { id: userData.id },
          data: {
            email: userData.email_addresses[0].email_address,
            name: userData.first_name + ' ' + userData.last_name,
            image: userData.image_url,
            externalId: userData.id,
          },
        });
        break;

      case 'user.deleted':
        await this.prisma.user.delete({ where: { id: userData.id } });
        break;
    }
  }
}
