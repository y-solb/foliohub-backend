import {
  Entity,
  Column,
  Index,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { UserProfile } from "./UserProfile";
import AuthToken from "./AuthToken";
import { AppDataSource } from "../data-source";
import { generateToken } from "../libs/token";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  username!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  google_id!: string;

  @OneToOne(() => UserProfile, { cascade: true })
  @JoinColumn()
  profile!: UserProfile;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  async generateUserToken() {
    const refreshToken = generateToken(
      {},
      {
        subject: "refresh_token",
        expiresIn: "14d",
      }
    );

    const authToken = new AuthToken();
    authToken.fk_user_id = this.id;
    authToken.token = refreshToken;
    authToken.expires_at = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await AppDataSource.getRepository(AuthToken).save(authToken);

    return {
      refreshToken,
    };
  }
}
