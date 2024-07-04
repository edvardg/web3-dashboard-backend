import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProjectType } from '../../common/enums/project-type.enum';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const projects: ProjectDto[] = [
        {
          id: 1,
          name: 'Test Project',
          type: ProjectType.TOKEN,
          logo: 'test_logo',
          price: 100,
          contractAddress: 'test_address',
        } as ProjectDto,
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(projects);

      expect(await controller.findAll()).toEqual(projects);
    });

    it('should return projects by search key', async () => {
      const projects: ProjectDto[] = [
        {
          id: 1,
          name: 'Test Project',
          type: ProjectType.TOKEN,
          logo: 'test_logo',
          price: 100,
          contractAddress: 'test_address',
        } as ProjectDto,
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(projects);

      expect(await controller.findAll('Test')).toEqual(projects);
      expect(service.findAll).toHaveBeenCalledWith('Test');
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const project: ProjectDto = {
        id: 1,
        name: 'Test Project',
        type: ProjectType.TOKEN,
        logo: 'test_logo',
        price: 100,
        contractAddress: 'test_address',
      } as ProjectDto;

      jest.spyOn(service, 'findOne').mockResolvedValue(project);

      expect(await controller.findOne(1)).toEqual(project);
    });

    it('should throw a NotFoundException if project not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
