import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumWalletAddress } from '../../../common/decorators/is-ethereum-address.decorator';

export class SignInUserDto {
  @ApiProperty({
    description: 'The Ethereum wallet address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsDefined()
  @IsEthereumWalletAddress()
  @IsNotEmpty({ message: 'Please provide user wallet address.' })
  walletAddress: string;

  @ApiProperty({ description: 'The signature of the SIWE message' })
  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'Please provide message signature.' })
  signature: string;

  @ApiProperty({ description: 'The SIWE message to be signed' })
  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'Please provide message.' })
  message: string;
}
