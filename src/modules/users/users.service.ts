import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { SiweMessage } from 'siwe';
import {
  FailedToSignInException,
  FailedToTrackProjectException,
  NoProjectFoundException,
  NoUserFoundException,
} from '../../common/exceptions';
import { Project } from '../projects/entities/project.entity';
import { User, UserProject } from './entities';
import { SignInUserDto, TokenDto, UserDto } from './dto';
import { UserProjectDto, TrackProjectDto } from './dto';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserProject)
    private readonly userProjectsRepository: Repository<UserProject>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    private jwtService: JwtService,
  ) {}

  async signinUser(signInUserDto: SignInUserDto): Promise<TokenDto> {
    await this.verifyUserMessage(signInUserDto);

    const { walletAddress } = signInUserDto;

    try {
      let user = await this.usersRepository.findOneBy({ walletAddress });
      if (!user) {
        this.logger.log(`No user with wallet address: ${walletAddress}, creating new user...`);

        user = this.usersRepository.create({ walletAddress });
        await this.usersRepository.save(user);
      }

      const payload = {
        id: user.id,
        walletAddress: user.walletAddress,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      this.logger.error('Failed to sign in, error: ', err.message);
      throw new FailedToSignInException(err.message);
    }
  }

  async getProfile(user: User): Promise<UserDto> {
    const { walletAddress } = user;

    const foundUser = await this.usersRepository.findOneBy({
      walletAddress,
    });
    if (!foundUser) {
      this.logger.error(`Failed to get user profile, no user with walletAddress: ${walletAddress}`);
      throw new NoUserFoundException(`No user with walletAddress: ${walletAddress}`);
    }

    return UserDto.fromEntity(foundUser);
  }

  async addTrackedProject(
    userId: number,
    trackProjectDto: TrackProjectDto,
  ): Promise<UserProjectDto> {
    const { projectId, bookmarked } = trackProjectDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`Failed to add tracked project, no user with ID: ${userId}`);
      throw new NoUserFoundException(`No user with ID: ${userId}`);
    }

    const project = await this.projectsRepository.findOne({ where: { id: projectId } });
    if (!project) {
      this.logger.error(`Failed to add tracked project, no project with ID: ${projectId}`);
      throw new NoProjectFoundException(`No project with ID: ${projectId}`);
    }

    try {
      let userProject = await this.userProjectsRepository.findOne({
        where: { user, project },
        relations: ['project'],
      });

      if (userProject) {
        userProject.bookmarked = bookmarked;
      } else {
        userProject = this.userProjectsRepository.create({ user, project, bookmarked });
      }
      userProject = await this.userProjectsRepository.save(userProject);

      return UserProjectDto.fromEntity(userProject);
    } catch (err) {
      this.logger.error('Failed to add tracked project, error: ', err.message);
      throw new FailedToTrackProjectException('Failed to add tracked project');
    }
  }

  async getTrackedProjects(userId: number): Promise<UserProjectDto[]> {
    const userProjects = await this.userProjectsRepository.find({
      where: { user: { id: userId } },
      relations: ['project'],
    });

    return userProjects.map(UserProjectDto.fromEntity);
  }

  async verifyUserMessage(signInUserDto: SignInUserDto): Promise<boolean> {
    const { message, signature } = signInUserDto;

    try {
      const siweMessage = new SiweMessage(message);
      await siweMessage.verify({ signature });

      return true;
    } catch (err) {
      this.logger.error('Failed to verify signature, error: ', err.message);
      throw new UnauthorizedException('Failed to verify signature');
    }
  }
}
