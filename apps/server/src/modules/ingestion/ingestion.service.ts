import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Event, EventType } from '@prisma/client';
import { ClickhouseService } from 'src/database/clickhouse.service';
import { PrismaService } from 'src/database/prisma.service';
import { IngestEventDto } from './dto/injest.dto';
@Injectable()
export class IngestionService {
  constructor(
    private prisma: PrismaService,
    private clickhouseService: ClickhouseService,
  ) {}

  async validateApiKey(projectId: string, apiKey: string): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { apiKey: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!project.apiKey) {
      throw new NotFoundException('API key not found');
    }

    if (project.apiKey.key !== apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  async ingest(body: IngestEventDto, projectId: string): Promise<void> {
    try {
      const existingEventWithSameMessage = await this.prisma.event.findFirst({
        where: {
          projectId,
          message: body.message,
        },
      });

      if (existingEventWithSameMessage) {
        await this.prisma.event.update({
          where: { id: existingEventWithSameMessage.id },
          data: { occurrences: existingEventWithSameMessage.occurrences + 1 },
        });
      } else {
        await this.prisma.event.create({
          data: {
            message: body.message,
            type: body.type,
            project: {
              connect: {
                id: projectId,
              },
            },
            timestamp: new Date(body.timestamp),
            occurrences: 1,
          },
        });

        const client = this.clickhouseService.getClient();
        const result = await client.insert({
          table: 'events',
          format: 'JSONEachRow',
          values: [{ ...body, projectId }],
        });

        console.log(result);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
