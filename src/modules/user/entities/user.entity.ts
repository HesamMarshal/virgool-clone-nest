import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  // Fileds

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  new_email: string;

  @Column({ nullable: true, default: false })
  verify_email: boolean;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true, default: false })
  verify_phone: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otpId: number;

  @Column({ nullable: true })
  profileId: number;

  //  Date & time
  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Table Connections
  @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: OtpEntity;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity;
}
