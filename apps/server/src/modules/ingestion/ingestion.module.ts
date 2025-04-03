import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { ClickhouseService } from 'src/database/clickhouse.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [IngestionService, ClickhouseService, PrismaService],
  controllers: [IngestionController],
})
export class IngestionModule {}
