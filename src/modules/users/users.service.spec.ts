import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SiweMessage } from 'siwe';
import { NoUserFoundException } from '../../common/exceptions';
import { UsersService } from './users.service';
import { User, UserProject } from './entities';
import { Project } from '../projects/entities/project.entity';
import { SignInUserDto, TrackProjectDto } from './dto';

jest.mock('siwe', () => {
  return {
    SiweMessage: jest.fn().mockImplementation(() => {
      return {
        verify: jest.fn(),
      };
    }),
  };
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let userProjectsRepository: Repository<UserProject>;
  let projectsRepository: Repository<Project>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserProject),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userProjectsRepository = module.get<Repository<UserProject>>(getRepositoryToken(UserProject));
    projectsRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signinUser', () => {
    it('should create a new user if not found and return a token', async () => {
      const signInUserDto: SignInUserDto = {
        message: 'test_message',
        signature: 'test_signature',
        walletAddress: 'test_address',
      };

      jest.spyOn(service, 'verifyUserMessage').mockResolvedValue(true);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(userRepository, 'create')
        .mockReturnValue({ id: 1, walletAddress: 'test_address' } as User);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue({ id: 1, walletAddress: 'test_address' } as User);

      const result = await service.signinUser(signInUserDto);

      expect(result).toEqual({ access_token: 'test_token' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ walletAddress: 'test_address' });
      expect(userRepository.create).toHaveBeenCalledWith({ walletAddress: 'test_address' });
      expect(userRepository.save).toHaveBeenCalledWith({ id: 1, walletAddress: 'test_address' });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: 1, walletAddress: 'test_address' });
    });

    it('should return a token if user is found', async () => {
      const signInUserDto: SignInUserDto = {
        message: 'test_message',
        signature: 'test_signature',
        walletAddress: 'test_address',
      };

      jest.spyOn(service, 'verifyUserMessage').mockResolvedValue(true);
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue({ id: 1, walletAddress: 'test_address' } as User);

      const result = await service.signinUser(signInUserDto);

      expect(result).toEqual({ access_token: 'test_token' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ walletAddress: 'test_address' });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: 1, walletAddress: 'test_address' });
    });

    it('should throw an error if verification fails', async () => {
      const signInUserDto: SignInUserDto = {
        message: 'test_message',
        signature: 'test_signature',
        walletAddress: 'test_address',
      };

      jest.spyOn(service, 'verifyUserMessage').mockRejectedValue(new UnauthorizedException());

      await expect(service.signinUser(signInUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { walletAddress: 'test_address' } as User;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await service.getProfile(user);

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ walletAddress: 'test_address' });
    });

    it('should throw an error if user is not found', async () => {
      const user = { walletAddress: 'test_address' } as User;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.getProfile(user)).rejects.toThrow(NoUserFoundException);
    });
  });

  describe('addTrackedProject', () => {
    it('should add a tracked project', async () => {
      const userId = 1;
      const trackProjectDto: TrackProjectDto = { projectId: 1, bookmarked: true };
      const user = { id: userId } as User;
      const project = { id: 1 } as Project;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(projectsRepository, 'findOne').mockResolvedValue(project);
      jest.spyOn(userProjectsRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(userProjectsRepository, 'create')
        .mockReturnValue({ id: 1, user, project, bookmarked: true } as UserProject);
      jest
        .spyOn(userProjectsRepository, 'save')
        .mockResolvedValue({ id: 1, user, project, bookmarked: true } as UserProject);

      const result = await service.addTrackedProject(userId, trackProjectDto);

      expect(result).toEqual({ id: 1, project, bookmarked: true });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(projectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: trackProjectDto.projectId },
      });
      expect(userProjectsRepository.save).toHaveBeenCalledWith({
        id: 1,
        user,
        project,
        bookmarked: trackProjectDto.bookmarked,
      });
    });
  });

  describe('getTrackedProjects', () => {
    it('should return tracked projects for a user', async () => {
      const userId = 1;
      const userProjects = [
        { id: 1, project: { id: 1, name: 'Test Project' }, bookmarked: true },
      ] as UserProject[];

      jest.spyOn(userProjectsRepository, 'find').mockResolvedValue(userProjects);

      const result = await service.getTrackedProjects(userId);

      expect(result).toEqual(userProjects);
      expect(userProjectsRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['project'],
      });
    });
  });

  describe('verifyUserMessage', () => {
    it('should verify user message', async () => {
      const signInUserDto: SignInUserDto = {
        message: 'test_message',
        signature: 'test_signature',
        walletAddress: 'test_address',
      };

      const mockVerify = jest.fn().mockResolvedValue({});
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: mockVerify,
      }));

      const result = await service.verifyUserMessage(signInUserDto);

      expect(result).toBe(true);
      expect(mockVerify).toHaveBeenCalledWith({ signature: 'test_signature' });
    });

    it('should throw an error if verification fails', async () => {
      const signInUserDto: SignInUserDto = {
        message: 'test_message',
        signature: 'test_signature',
        walletAddress: 'test_address',
      };

      const mockVerify = jest.fn().mockRejectedValue(new Error('Verification failed'));
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: mockVerify,
      }));

      await expect(service.verifyUserMessage(signInUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
