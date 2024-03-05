import {
  Entity,
  Column,
  Index,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Portfolio } from './Portfolio';
import AuthToken from './AuthToken';
import { AppDataSource } from '../data-source';
import { generateToken } from '../libs/token';
import { JobCategory } from './JobCategory';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  userId!: string;

  @Column()
  provider!: 'google';

  @Index()
  @Column({ unique: true, length: 255 })
  providerId!: string;

  @OneToOne(() => Portfolio, (portfolio) => portfolio.user, { cascade: true })
  portfolio!: Portfolio;

  @Column({ nullable: true })
  jobCategoryCode!: string;

  @ManyToOne(() => JobCategory)
  @JoinColumn({ name: 'jobCategoryCode' })
  jobCategory!: JobCategory;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  async generateUserToken() {
    const refreshToken = generateToken(
      {},
      {
        subject: 'refreshToken',
        expiresIn: '14d',
      }
    );

    const authToken = new AuthToken();
    authToken.fkUserId = this.id;
    authToken.token = refreshToken;
    authToken.expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await AppDataSource.getRepository(AuthToken).save(authToken);

    return {
      refreshToken,
    };
  }
}
