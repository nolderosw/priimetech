import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../domain/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Role do usuário', enum: UserRole })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
