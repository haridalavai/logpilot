import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './database/prisma.service';
import { ClickhouseService } from './database/clickhouse.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: [`.env`],
    isGlobal: true,
  }),
    AuthenticationModule,],
  controllers: [AppController],
  providers: [AppService, PrismaService, ClickhouseService],
  exports: [ClickhouseService],
})
export class AppModule { }
