import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from '../../domain/entities/access-log.entity';
import { IAccessLogRepository } from '../../domain/repositories/access-log.repository.interface';

@Injectable()
export class AccessLogRepository implements IAccessLogRepository {
  constructor(
    @InjectRepository(AccessLog)
    private readonly accessLogRepository: Repository<AccessLog>,
  ) {}

  async create(log: Partial<AccessLog>): Promise<AccessLog> {
    const newLog = this.accessLogRepository.create(log);
    return await this.accessLogRepository.save(newLog);
  }
}
