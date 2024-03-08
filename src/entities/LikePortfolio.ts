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

  @Column()
  status!: boolean;

  @Column('uuid')
  fkUserId!: string;

  @Column('uuid')
  fkPortfolioId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fkUserId' })
  user!: User;

  @ManyToOne(() => Portfolio)
  @JoinColumn({ name: 'fkPortfolioId' })
  portfolio!: Portfolio;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
