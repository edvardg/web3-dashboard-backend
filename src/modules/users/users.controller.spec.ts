import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ProjectType } from '../../common/enums/project-type.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SignInUserDto, TokenDto, TrackProjectDto, UserDto, UserProjectDto } from './dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            signinUser: jest.fn(),
            getProfile: jest.fn(),
            addTrackedProject: jest.fn(),
            getTrackedProjects: jest.fn(),
          },
        },
      ],
      imports: [JwtModule.register({ secret: 'test_secret' })],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signin', () => {
    it('should return a token', async () => {
      const signInUserDto: SignInUserDto = {
        message: 'test_message',
        signature: 'test_signature',
        walletAddress: 'test_address',
      };
      const token: TokenDto = { access_token: 'test_token' };

      jest.spyOn(service, 'signinUser').mockResolvedValue(token);

      const result = await controller.signIn(signInUserDto);

      expect(result).toEqual(token);
      expect(service.signinUser).toHaveBeenCalledWith(signInUserDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userDto: UserDto = { id: 1, walletAddress: 'test_address' };

      jest.spyOn(service, 'getProfile').mockResolvedValue(userDto);

      const result = await controller.getProfile({
        user: { id: 1, walletAddress: 'test_address' },
      });

      expect(result).toEqual(userDto);
      expect(service.getProfile).toHaveBeenCalledWith({ id: 1, walletAddress: 'test_address' });
    });

    it('should throw an UnauthorizedException if user is not authenticated', async () => {
      jest.spyOn(service, 'getProfile').mockRejectedValue(new UnauthorizedException());

      await expect(controller.getProfile({ user: null })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('addTrackedProject', () => {
    it('should add a tracked project', async () => {
      const trackProjectDto: TrackProjectDto = { projectId: 1, bookmarked: true };
      const userProjectDto: UserProjectDto = {
        id: 1,
        project: {
          id: 1,
          name: 'Test Project',
          type: ProjectType.TOKEN,
          logo: 'test_logo',
          price: 100,
          contractAddress: 'test_address',
        },
        bookmarked: true,
      };

      jest.spyOn(service, 'addTrackedProject').mockResolvedValue(userProjectDto);

      const result = await controller.addTrackedProject(
        { user: { id: 1, walletAddress: 'test_address' } },
        trackProjectDto,
      );

      expect(result).toEqual(userProjectDto);
      expect(service.addTrackedProject).toHaveBeenCalledWith(1, trackProjectDto);
    });
  });

  describe('getTrackedProjects', () => {
    it('should return tracked projects for a user', async () => {
      const userProjects: UserProjectDto[] = [
        {
          id: 1,
          project: {
            id: 1,
            name: 'Test Project',
            type: ProjectType.TOKEN,
            logo: 'test_logo',
            price: 100,
            contractAddress: 'test_address',
          },
          bookmarked: true,
        },
      ];

      jest.spyOn(service, 'getTrackedProjects').mockResolvedValue(userProjects);

      const result = await controller.getTrackedProjects({
        user: { id: 1, walletAddress: 'test_address' },
      });

      expect(result).toEqual(userProjects);
      expect(service.getTrackedProjects).toHaveBeenCalledWith(1);
    });
  });
});
