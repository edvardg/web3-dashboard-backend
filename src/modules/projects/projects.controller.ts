import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [ProjectDto],
    description: 'Successfully retrieved all projects',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to access this resource',
  })
  @ApiQuery({
    name: 'key',
    description: 'Search key for project name or contract address',
    type: String,
    required: false,
  })
  @Get()
  async findAll(@Query('key') key?: string): Promise<ProjectDto[]> {
    return this.projectsService.findAll(key);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProjectDto,
    description: 'Successfully retrieved project by id',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to access this resource',
  })
  @ApiNotFoundResponse({
    description: 'Project not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    type: String,
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProjectDto> {
    return this.projectsService.findOne(id);
  }
}
