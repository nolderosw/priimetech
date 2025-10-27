import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../../../users/application/services/user.service';
import { LogsService } from '../../../logs/application/services/logs.service';
import { LoginDto } from '../../../users/application/dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockLogsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: LogsService,
          useValue: mockLogsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('deve lançar UnauthorizedException quando o usuário não existe', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto, '127.0.0.1')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve lançar UnauthorizedException quando a senha é inválida', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.validatePassword.mockResolvedValue(false);

      await expect(service.login(loginDto, '127.0.0.1')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve fazer login com sucesso e retornar token', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.validatePassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');
      mockLogsService.create.mockResolvedValue({});

      const result = await service.login(loginDto, '127.0.0.1');

      expect(result).toEqual({
        access_token: 'jwt-token',
        userId: '123',
        email: 'test@example.com',
      });
      expect(mockLogsService.create).toHaveBeenCalledWith({
        userId: '123',
        email: 'test@example.com',
        action: 'login',
        ip: '127.0.0.1',
      });
    });
  });
});
