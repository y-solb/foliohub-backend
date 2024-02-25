import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Asset } from './Asset';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  displayName!: string;

  @Column({ length: 255 })
  shortBio!: string;

  @Column()
  thumbnail!: string;

  @OneToOne(() => User, (user) => user.portfolio)
  user!: User;

  @OneToMany(() => Asset, (asset) => asset.portfolio)
  assets!: Asset[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
