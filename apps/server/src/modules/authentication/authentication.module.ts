import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ClerkWebhookService } from './clerk-webhook.service';
import { ClerkWebhookController } from './clerk-webhook.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [JwtStrategy, JwtAuthGuard, ClerkWebhookService, PrismaService],
  controllers: [ClerkWebhookController],
})
export class AuthenticationModule {}
