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

  @Column({ length: 255 })
  shortBio!: string;

  @Column({ length: 255 })
  githubId!: string;

  @Column({ length: 255 })
  imageUrl!: string;

  @Column({ length: 255 })
  link!: string;

  @Column('text')
  content!: string;

  @Column()
  lgX!: number;

  @Column()
  lgY!: number;

  @Column()
  lgWidth!: number;

  @Column()
  lgHeight!: number;

  @Column()
  mdX!: number;

  @Column()
  mdY!: number;

  @Column()
  mdWidth!: number;

  @Column()
  mdHeight!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.assets, { onDelete: 'CASCADE' })
  @JoinColumn()
  portfolio!: Portfolio;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
