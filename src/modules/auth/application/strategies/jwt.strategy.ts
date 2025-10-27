import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CacheRedisService } from '../../../shared/cache/services/cache-redis.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private cacheService: CacheRedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'priimetech-super-secret-key-2024-dev',
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: JwtPayload) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authHeader.substring(7);

    const keys = await this.cacheService.getKeysByPattern(
      `token:${payload.sub}:*`,
    );

    let tokenFound = false;
    for (const key of keys) {
      const cachedToken = await this.cacheService.get(key);
      if (cachedToken === token) {
        tokenFound = true;
        break;
      }
    }

    if (!tokenFound) {
      throw new UnauthorizedException('Token not found in cache or expired');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
