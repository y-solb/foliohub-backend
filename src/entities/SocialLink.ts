import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class SocialLink {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: true })
  blogLink!: string;

  @Column({ length: 255, nullable: true })
  linkedinLink!: string;

  @Column({ length: 255, nullable: true })
  githubLink!: string;

  @Column({ length: 255, nullable: true })
  instagramLink!: string;

  @Column({ length: 255, nullable: true })
  facebookLink!: string;

  @Column({ length: 255, nullable: true })
  twitterLink!: string;

  @Column({ length: 255, nullable: true })
  youtubeLink!: string;

  @Column('uuid')
  userId!: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
