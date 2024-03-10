import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Portfolio } from './Portfolio';
import { User } from './User';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  type!: 'github' | 'link' | 'image' | 'content';

  @Column({ length: 255, nullable: true })
  githubId!: string;

  @Column({ length: 255, nullable: true })
  imageUrl!: string;

  @Column({ length: 255, nullable: true })
  link!: string;

  @Column('text', { nullable: true })
  content!: string;

  @Column('uuid')
  layoutId!: string;

  @Column('json', { nullable: true })
  pos!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  portfolioId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.assets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolioId' })
  portfolio!: Portfolio;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
