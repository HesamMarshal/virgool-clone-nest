import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone } from "class-validator";
import { ValidationMessage } from "src/common/enums/message.enum";

@Entity(EntityName.Profile)
export class ProfileEntity extends BaseEntity {
  @Column()
  nick_name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  bg_image: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthday: Date;

  // Social Media
  @Column({ nullable: true })
  linkedin_profile: string;

  @Column({ nullable: true })
  x_profile: string;

  // Connection to user table
  @Column()
  userId: number;
  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: "CASCADE" })
  user: UserEntity;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: ValidationMessage.InvalidEmailForamt })
  email: string;
}

export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhoneForamt })
  phone: string;
}
