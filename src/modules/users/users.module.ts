import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserService } from './application/services/user.service';
import { UserController } from './presentation/controllers/user.controller';
import { User } from './domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserService, 'IUserRepository'],
})
export class UsersModule {}
