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
import { User, Project } from '@prisma/client';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.',  })
  @ApiBody({ type: CreateProjectDto })
  @ApiBearerAuth()
  createProject(
    @Body() projectData: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.createProject(projectData, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all projects by user id' })
  @ApiResponse({ status: 200, description: 'The projects have been successfully retrieved.' })
  @ApiBearerAuth()
  getProjectsByUserId(@CurrentUser() user: User) {
    return this.projectsService.getProjectsByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiResponse({ status: 200, description: 'The project has been successfully retrieved.' })
  @ApiBearerAuth()
  getProjectById(@Param('id') projectId: string) {
    return this.projectsService.getProjectById(projectId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a project by id' })
  @ApiResponse({ status: 200, description: 'The project has been successfully updated.' })
  @ApiBearerAuth()
  updateProject(
    @Param('id') projectId: string,
    @Body() projectData: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(projectId, projectData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a project by id' })
  @ApiResponse({ status: 200, description: 'The project has been successfully deleted.' })
  @ApiBearerAuth()
  deleteProject(@Param('id') projectId: string) {
    return this.projectsService.deleteProject(projectId);
  }

  @Get(':id/api-key')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Rotate a project api key' })
  @ApiResponse({ status: 200, description: 'The project api key has been successfully rotated.' })
  @ApiBearerAuth()
  rotateApiKey(@Param('id') projectId: string) {
    return this.projectsService.rotateApiKey(projectId);
  }
}
