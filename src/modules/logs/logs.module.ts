import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLog } from './domain/entities/access-log.entity';
import { AccessLogRepository } from './infrastructure/repositories/access-log.repository';
import { LogsService } from './application/services/logs.service';
import { RabbitMQService } from './infrastructure/services/rabbitmq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLog]),
  ],
  providers: [
    LogsService,
    RabbitMQService,
    {
      provide: 'IAccessLogRepository',
      useClass: AccessLogRepository,
    },
  ],
  exports: [LogsService],
})
export class LogsModule {}
