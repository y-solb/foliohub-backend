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

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  type!: 'github' | 'card' | 'image' | 'content';

  @Column({ length: 255, nullable: true })
  githubId!: string;

  @Column({ length: 255, nullable: true })
  imageUrl!: string;

  @Column({ length: 255, nullable: true })
  link!: string;

  @Column('text', { nullable: true })
  content!: string;

  @Column({ length: 255, nullable: true })
  title!: string;

  @Column({ length: 255, nullable: true })
  description!: string;

  @Column('uuid')
  layoutId!: string;

  @Column('json', { nullable: true })
  pos!: string;

  @Column({ default: true })
  status!: boolean;

  @Column('uuid')
  portfolioId!: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.assets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolioId' })
  portfolio!: Portfolio;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
