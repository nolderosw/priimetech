import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../../domain/enums/user-role.enum';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve lançar ConflictException quando o email já existe', async () => {
      const createUserDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
      };

      mockRepository.findByEmail.mockResolvedValue({
        id: '1',
        ...createUserDto,
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar um novo usuário com sucesso', async () => {
      const createUserDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
      };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({
        id: '123',
        ...createUserDto,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(mockRepository.create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('deve lançar NotFoundException quando o usuário não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('123')).rejects.toThrow(NotFoundException);
    });

    it('deve retornar o usuário sem a senha', async () => {
      const mockUser = {
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('123');

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findByEmail', () => {
    it('deve retornar um usuário pelo email', async () => {
      const mockUser = {
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toBe(mockUser);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('deve retornar null quando não encontrar usuário', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários sem senhas', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          password: 'hash1',
          role: UserRole.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          password: 'hash2',
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[1]).not.toHaveProperty('password');
    });
  });

  describe('findAllPaginated', () => {
    it('deve retornar usuários paginados com valores padrão', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          password: 'hash1',
          role: UserRole.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.findAllPaginated();

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('deve retornar usuários paginados com parâmetros customizados', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          password: 'hash1',
          role: UserRole.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.findAllPaginated(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('deve calcular totalPages corretamente', async () => {
      const mockUsers = Array.from({ length: 25 }, (_, i) => ({
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: 'hash',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 25]);

      const result = await service.findAllPaginated(1, 10);

      expect(result.totalPages).toBe(3);
      expect(result.total).toBe(25);
    });
  });

  describe('validatePassword', () => {
    it('deve retornar boolean ao validar senha', async () => {
      const mockUser = {
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        password: '$2b$10$hashedPassword',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await service.validatePassword(mockUser, 'password123');

      expect(typeof result).toBe('boolean');
    });
  });
});
