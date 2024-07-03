import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from './User';
import { Portfolio } from './Portfolio';

@Entity()
export class LikePortfolio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: true })
  status!: boolean;

  @Column('uuid', { nullable: true })
  userId!: string | null;

  @Column('uuid')
  portfolioId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Portfolio)
  @JoinColumn({ name: 'portfolioId' })
  portfolio!: Portfolio;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
