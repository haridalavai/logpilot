import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { ApiKey, Project } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) { }

  async createProject(
    projectData: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    try {
      const slug =
        projectData.slug || projectData.name.toLowerCase().replace(/\s+/g, '-');

      const existingProject = await this.prisma.project.findFirst({
        where: { slug: slug },
      });

      if (existingProject) {
        console.log('Project with this slug already exists');
        throw new ConflictException('Project with this slug already exists');
      }

      const apiKey = await this.generateApiKey(projectData.name);

      const project = await this.prisma.project.create({
        data: {
          name: projectData.name,
          slug: slug,
          userId: userId,
        },
      });

      await this.prisma.apiKey.create({
        data: {
          key: apiKey,
          project: {
            connect: {
              id: project.id,
            },
          },
        },
      });


      return project;
    } catch (error) {
      console.log('Failed to create project', error);
      throw error;
    }
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    try {
      return await this.prisma.project.findMany({
        where: {
          userId: userId,
        },
        include: {
          apiKey: true,
        },
      });
    } catch (error) {
      console.log('Failed to get projects by user id', error);
      throw error;
    }
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          id: projectId,
        },
        include: {
          apiKey: true,
        },
      });

      if (!project) {
        console.log('Project not found');
        throw new NotFoundException('Project not found');
      }

      return project;
    } catch (error) {
      console.log('Failed to get project by id', error);
      throw error;
    }
  }

  async updateProject(
    projectId: string,
    projectData: UpdateProjectDto,
  ): Promise<Project> {
    try {
      return await this.prisma.project.update({
        where: { id: projectId },
        data: projectData,
      });
    } catch (error) {
      console.log('Failed to update project', error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<Project> {
    try {
      return await this.prisma.project.delete({
        where: { id: projectId },
      });
    } catch (error) {
      console.log('Failed to delete project', error);
      throw error;
    }
  }

  async rotateApiKey(projectId: string): Promise<ApiKey> {
    try {
      const key = await this.generateApiKey(projectId);
      const apiKey = await this.prisma.apiKey.update({
        where: { projectId: projectId },
        data: {
          key: key,
        },
      });
      return apiKey;
    } catch (error) {
      console.log('Failed to rotate api key', error);
      throw error;
    }
  }

  private async generateApiKey(projectId: string): Promise<string> {
    const key = `lg_${projectId}_${uuidv4()}`;
    return key;
  }
}
