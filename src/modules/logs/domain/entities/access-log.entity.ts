import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  @Index()
  email: string;

  @Column()
  action: string;

  @Column()
  ip: string;

  @CreateDateColumn()
  timestamp: Date;
}
