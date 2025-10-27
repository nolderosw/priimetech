import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogsModule } from './modules/logs/logs.module';
import { CacheModule } from './modules/shared/cache/cache.module';
import { User } from './modules/users/domain/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'authdb',
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([User]),
    CacheModule,
    UsersModule,
    AuthModule,
    LogsModule,
  ],
})
export class AppModule {}
