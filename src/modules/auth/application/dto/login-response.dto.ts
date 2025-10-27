import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  access_token: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;
}
