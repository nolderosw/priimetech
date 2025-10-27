import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

