import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from '../../projects/dto/project.dto';
import { UserProject } from '../entities';

export class UserProjectDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  bookmarked: boolean;

  @ApiProperty({ type: ProjectDto })
  project: ProjectDto;

  static fromEntity(userProject: UserProject): UserProjectDto {
    const userProjectDto = new UserProjectDto();
    userProjectDto.id = userProject.id;
    userProjectDto.project = ProjectDto.fromEntity(userProject.project);
    userProjectDto.bookmarked = userProject.bookmarked;
    return userProjectDto;
  }
}
