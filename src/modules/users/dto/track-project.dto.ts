import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsBoolean, IsInt, Min } from 'class-validator';

export class TrackProjectDto {
  @ApiProperty({
    description: 'The ID of the project to be tracked',
    example: 1,
  })
  @IsDefined()
  @IsInt()
  @Min(1)
  projectId: number;

  @ApiProperty({
    description: 'Indicates if the project is bookmarked',
    example: true,
  })
  @IsDefined()
  @IsBoolean()
  bookmarked: boolean;
}
