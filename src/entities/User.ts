import {
  Entity,
  Column,
  Index,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfile } from './UserProfile';
import AuthToken from './AuthToken';
import { AppDataSource } from '../data-source';
import { generateToken } from '../libs/token';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  username!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  googleId!: string;

  @OneToOne(() => UserProfile, { cascade: true })
  @JoinColumn()
  profile!: UserProfile;

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
