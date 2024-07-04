import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  walletAddress: string;

  static fromEntity(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.walletAddress = user.walletAddress;
    return userDto;
  }
}
