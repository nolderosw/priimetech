import { AccessLog } from '../entities/access-log.entity';

export abstract class IAccessLogRepository {
  abstract create(log: Partial<AccessLog>): Promise<AccessLog>;
}
