import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  async findAllPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAndCount(skip, limit);

    const data = users.map(({ password, ...rest }) => rest);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}
