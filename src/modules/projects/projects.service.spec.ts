import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ProjectType } from '../../common/enums/project-type.enum';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects: Project[] = [
        {
          id: 1,
          name: 'Test Project',
          type: ProjectType.TOKEN,
          logo: 'test_logo',
          price: 100,
          contractAddress: 'test_address',
          userProjects: [],
        } as Project,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(projects);

      expect(await service.findAll()).toEqual(projects);
    });

    it('should return projects by search key', async () => {
      const projects: Project[] = [
        {
          id: 1,
          name: 'Test Project',
          type: ProjectType.TOKEN,
          logo: 'test_logo',
          price: 100,
          contractAddress: 'test_address',
          userProjects: [],
        } as Project,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(projects);

      expect(await service.findAll('Test')).toEqual(projects);
      expect(repository.find).toHaveBeenCalledWith({
        where: [{ name: Like(`%Test%`) }, { contractAddress: Like(`%Test%`) }],
      });
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const project: Project = {
        id: 1,
        name: 'Test Project',
        type: ProjectType.TOKEN,
        logo: 'test_logo',
        price: 100,
        contractAddress: 'test_address',
        userProjects: [],
      } as Project;

      jest.spyOn(repository, 'findOne').mockResolvedValue(project);

      expect(await service.findOne(1)).toEqual(project);
    });

    it('should throw a NotFoundException if project not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
