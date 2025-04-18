import {
  Controller,
  Post,
  Body,
  Param,
  Header,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestEventDto } from './dto/injest.dto';
import { ApiHeader } from '@nestjs/swagger';
@Controller('ingest')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post(':projectId')
  @ApiHeader({
    name: 'x-api-key',
    description: 'The API key for the project',
  })
  async ingest(
    @Request() request: Request,
    @Param('projectId') projectId: string,
    @Body() body: IngestEventDto,
  ) {
    const apiKey = request.headers['x-api-key'];
    const apiKeyFromDb = await this.ingestionService.validateApiKey(
      projectId,
      apiKey,
    );

    if (!apiKeyFromDb) {
      throw new UnauthorizedException('Invalid API key');
    }

    return this.ingestionService.ingest(body, projectId);
  }
}
