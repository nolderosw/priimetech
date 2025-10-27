import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { Roles } from '../../../auth/application/decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';

export interface PaginatedUsersDto {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'cria um novo usuario' })
  @ApiResponse({ status: 201, description: 'usuario criado com sucesso' })
  @ApiResponse({ status: 409, description: 'email ja em uso' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'lista os usuarios paginados (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'lista de usuarios paginados' })
  @ApiResponse({ status: 403, description: 'acesso negado' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.userService.findAllPaginated(page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findById(id);
  }
}
