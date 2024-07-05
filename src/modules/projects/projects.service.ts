import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  private logger: Logger = new Logger(ProjectsService.name);

  constructor(@InjectRepository(Project) private projectsRepository: Repository<Project>) {}

  async findAll(key?: string): Promise<ProjectDto[]> {
    let findOptions: FindManyOptions<Project> = {};

    if (key) {
      findOptions = {
        where: [{ name: ILike(`%${key}%`) }, { contractAddress: ILike(`%${key}%`) }],
      };
    }

    return this.projectsRepository.find(findOptions);
  }

  async findOne(id: number): Promise<ProjectDto> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      this.logger.error(`Project with ID ${id} not found`);
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }
}
