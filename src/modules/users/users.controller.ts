import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { SignInUserDto, TokenDto, UserDto, TrackProjectDto, UserProjectDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokenDto,
    description: 'Successfully Signed In',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid input data.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid signature or message.',
  })
  @ApiBody({
    description: 'SignInUserDto',
    type: SignInUserDto,
    required: true,
  })
  @Post('signin')
  async signIn(@Body() signInUserDto: SignInUserDto): Promise<TokenDto> {
    return this.usersService.signinUser(signInUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserDto,
    description: 'Successfully retrieved user profile',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to access this resource',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async getProfile(@Request() req): Promise<UserDto> {
    return this.usersService.getProfile(req.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Successfully added tracked project',
    type: UserProjectDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid input data.',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to access this resource',
  })
  @ApiBody({
    description: 'TrackProjectDto',
    type: TrackProjectDto,
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('tracked-projects')
  async addTrackedProject(
    @Request() req,
    @Body() trackProjectDto: TrackProjectDto,
  ): Promise<UserProjectDto> {
    return this.usersService.addTrackedProject(req.user.id, trackProjectDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully retrieved tracked projects',
    type: [UserProjectDto],
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to access this resource',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('tracked-projects')
  async getTrackedProjects(@Request() req): Promise<UserProjectDto[]> {
    return this.usersService.getTrackedProjects(req.user.id);
  }
}
