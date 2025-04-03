import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';
import { ClickhouseService } from './database/clickhouse.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly clickhouseService: ClickhouseService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getHello(): Promise<Record<string, any>> {
    const client = this.clickhouseService.getClient();
    const result = await client.query({
      query: 'SELECT * from system.tables',
      format: 'JSON',
    });
    return result.json();
  }
}
