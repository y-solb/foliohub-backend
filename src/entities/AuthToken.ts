import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export default class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  fkUserId!: string;

  @Index()
  @Column({ unique: true })
  token!: string;

  @Column('timestamp')
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fkUserId' })
  user!: User;
}
