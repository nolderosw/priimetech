import { Injectable, Inject, Logger } from '@nestjs/common';
import { IAccessLogRepository } from '../../domain/repositories/access-log.repository.interface';
import { CreateAccessLogDto } from '../dto/create-access-log.dto';
import { RabbitMQService } from '../../infrastructure/services/rabbitmq.service';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(
    @Inject('IAccessLogRepository')
    private readonly accessLogRepository: IAccessLogRepository,
    private readonly messagingService: RabbitMQService,
  ) {}

  async create(createAccessLogDto: CreateAccessLogDto) {
    try {
      await this.messagingService.publishAuditLog({
        userId: createAccessLogDto.userId,
        email: createAccessLogDto.email,
        action: createAccessLogDto.action,
        ip: createAccessLogDto.ip,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Failed to publish audit log to RabbitMQ', error);
    }

    return await this.accessLogRepository.create(createAccessLogDto);
  }
}
