import { ApiProperty } from '@nestjs/swagger';
import { ProjectType } from '../../../common/enums/project-type.enum';
import { Project } from '../entities/project.entity';

export class ProjectDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ProjectType })
  type: ProjectType;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  contractAddress: string;

  static fromEntity(project: Project): ProjectDto {
    const projectDto = new ProjectDto();
    projectDto.id = project.id;
    projectDto.name = project.name;
    projectDto.type = project.type;
    projectDto.logo = project.logo;
    projectDto.price = project.price;
    projectDto.contractAddress = project.contractAddress;
    return projectDto;
  }
}
