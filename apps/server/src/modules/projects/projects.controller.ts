import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createProject(
    @Body() projectData: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.createProject(projectData, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getProjectsByUserId(@CurrentUser() user: User) {
    return this.projectsService.getProjectsByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProjectById(@Param('id') projectId: string) {
    return this.projectsService.getProjectById(projectId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @Param('id') projectId: string,
    @Body() projectData: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(projectId, projectData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProject(@Param('id') projectId: string) {
    return this.projectsService.deleteProject(projectId);
  }

  @Get(':id/api-key')
  @UseGuards(JwtAuthGuard)
  rotateApiKey(@Param('id') projectId: string) {
    return this.projectsService.rotateApiKey(projectId);
  }
}
