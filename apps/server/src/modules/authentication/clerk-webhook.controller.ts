import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Webhook } from 'svix';

import { ClerkWebhookService } from './clerk-webhook.service';

@Controller('auth')
export class ClerkWebhookController {
  constructor(private readonly clerkWebhookService: ClerkWebhookService) {}

  @Post('clerk-webhook')
  async handleClerkWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string
  ) {
    const configService = new ConfigService();
    const SIGNING_SECRET = configService.get<string>('CLERK_WEBHOOK_SECRET');
    if (!SIGNING_SECRET) {
      console.error('Clerk signing secret not set');
      return res.status(500).send('Server error');
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).send('Missing Svix headers');
    }

    // Convert request body to string
    const payload = req.body;
    const body = JSON.stringify(payload);

    // Verify webhook signature
    const wh = new Webhook(SIGNING_SECRET);
    let event;
    try {
      event = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).send('Verification failed');
    }

    console.log(`Received Clerk webhook event: ${event.type}`);
    
    // Process event in WebhookService
    await this.clerkWebhookService.processClerkEvent(event.type, event.data);

    return res.sendStatus(200);
  }
}
