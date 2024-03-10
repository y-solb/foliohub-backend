import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Asset } from './Asset';
import { JobCategory } from './JobCategory';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: true })
  displayName!: string;

  @Column({ length: 255, nullable: true })
  shortBio!: string;

  @Column({ nullable: true })
  thumbnail!: string;

  @Column('json', { nullable: true })
  layout!: string;

  @Column({ default: 0 })
  likeCount!: number;

  @Column('uuid')
  userId!: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Asset, (asset) => asset.portfolio)
  assets!: Asset[];

  @Column({ nullable: true })
  jobCategoryCode!: string;

  @ManyToOne(() => JobCategory)
  @JoinColumn({ name: 'jobCategoryCode', referencedColumnName: 'code' })
  jobCategory!: JobCategory;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
