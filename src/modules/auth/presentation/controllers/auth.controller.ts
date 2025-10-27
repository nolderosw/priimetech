import {
  Controller,
  Post,
  Body,
  Ip,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../../../users/application/dto/login.dto';
import { LoginResponseDto } from '../../application/dto/login-response.dto';
import { LogoutDto } from '../../application/dto/logout.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'fazer login' })
  @ApiResponse({
    status: 200,
    description: 'login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'credenciais invalidas' })
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto, ip);
  }

  @Post('logout')
  @ApiOperation({ summary: 'fazer logout' })
  @ApiBody({
    type: LogoutDto,
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'ID do usuário',
          example: '1',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'logout realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logout realizado com sucesso',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'userId não fornecido' })
  async logout(@Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    if (!logoutDto.userId) {
      throw new BadRequestException('userId is required');
    }
    await this.authService.logout(logoutDto.userId);
    return { message: 'Logout realizado com sucesso' };
  }
}
