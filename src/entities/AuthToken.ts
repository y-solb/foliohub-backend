import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity("auth_tokens")
export default class AuthToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  fk_user_id!: string;

  @Index()
  @Column({ unique: true })
  token!: string;

  @Column("timestamp")
  expires_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fk_user_id" })
  user!: User;
}
