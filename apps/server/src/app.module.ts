import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './database/prisma.service';
import { ClickhouseService } from './database/clickhouse.service';
import { ProjectsModule } from './modules/projects/projects.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: [`.env`],
    isGlobal: true,
  }),
    AuthenticationModule,
    ProjectsModule,
    IngestionModule,],
  controllers: [AppController],
  providers: [AppService, ClickhouseService],
  exports: [ClickhouseService],
})
export class AppModule { }
