import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Asset } from './Asset';

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

  @Column('uuid')
  fkUserId!: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'fkUserId' })
  user!: User;

  @OneToMany(() => Asset, (asset) => asset.portfolio)
  assets!: Asset[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
