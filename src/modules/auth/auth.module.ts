import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { RolesGuard } from './application/guards/roles.guard';
import { UsersModule } from '../users/users.module';
import { LogsModule } from '../logs/logs.module';
import { CacheModule } from '../shared/cache/cache.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    LogsModule,
    CacheModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'priimetech-super-secret-key-2024-dev',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
