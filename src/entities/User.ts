import {
  Entity,
  Column,
  Index,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Portfolio } from './Portfolio';
import AuthToken from './AuthToken';
import { AppDataSource } from '../data-source';
import { generateToken } from '../libs/token';
import { SocialLink } from './SocialLink';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  username!: string;

  @Column()
  provider!: 'google';

  @Index()
  @Column({ unique: true, length: 255 })
  providerId!: string;

  @OneToOne(() => Portfolio, (portfolio) => portfolio.user, { cascade: true })
  portfolio!: Portfolio;

  @OneToOne(() => SocialLink, (socialLink) => socialLink.user, { cascade: true })
  socialLink!: SocialLink;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  async generateUserToken() {
    const accessToken = generateToken(
      {
        userId: this.id,
      },
      {
        subject: 'accessToken',
        expiresIn: '1h',
      }
    );

    const refreshToken = generateToken(
      {},
      {
        subject: 'refreshToken',
        expiresIn: '14d',
      }
    );

    const authToken = new AuthToken();
    authToken.userId = this.id;
    authToken.token = refreshToken;
    authToken.expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await AppDataSource.getRepository(AuthToken).save(authToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
