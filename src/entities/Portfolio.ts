import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  displayName!: string;

  @Column({ length: 255 })
  shortBio!: string;

  @Column({ length: 255 })
  thumbnail!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
