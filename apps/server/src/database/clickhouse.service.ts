import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, ClickHouseClient } from '@clickhouse/client';

@Injectable()
export class ClickhouseService implements OnModuleInit, OnModuleDestroy {
  private client: ClickHouseClient;

  constructor() {
    this.client = createClient({
      host: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
      username: process.env.CLICKHOUSE_USER || 'default',
      password: process.env.CLICKHOUSE_PASSWORD || '',
      database: process.env.CLICKHOUSE_DB || 'default',
    });
  }

  async onModuleInit() {
    console.log('✅ Connected to ClickHouse');
  }

  async onModuleDestroy() {
    console.log('🛑 Closing ClickHouse connection');
    await this.client.close();
  }

  getClient() {
    return this.client;
  }
}
