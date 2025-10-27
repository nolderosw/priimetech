import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract create(user: Partial<User>): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract findAndCount(skip: number, limit: number): Promise<[User[], number]>;
}
