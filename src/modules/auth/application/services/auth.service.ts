import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../users/application/services/user.service';
import { LoginDto } from '../../../users/application/dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtPayload } from '../strategies/jwt.strategy';
import { LogsService } from '../../../logs/application/services/logs.service';
import { CacheRedisService } from '../../../shared/cache/services/cache-redis.service';
import { User } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private logsService: LogsService,
    private cacheService: CacheRedisService,
  ) {}

  async login(loginDto: LoginDto, ip: string): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.validatePassword(
      user,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);
    const tokenId = crypto.randomUUID();

    const cacheKey = `token:${user.id}:${tokenId}`;
    await this.cacheService.set(cacheKey, access_token, 3600);

    await this.logsService.create({
      userId: user.id,
      email: user.email,
      action: 'login',
      ip,
    });

    return {
      access_token,
      userId: user.id,
      email: user.email,
    };
  }

  async logout(userId: string): Promise<void> {
    const keys = await this.cacheService.getKeysByPattern(`token:${userId}:*`);
    for (const key of keys) {
      await this.cacheService.del(key);
    }
  }
}
