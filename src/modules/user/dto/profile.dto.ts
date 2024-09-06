import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  Length,
} from "class-validator";
import { Gender } from "../enums/gender.enum";
import { ValidationMessage } from "src/common/enums/message.enum";

export class ProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 50)
  nick_name: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(10, 200)
  bio: string;

  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: string;

  @ApiPropertyOptional({ nullable: true, example: "2024-09-04T10:03:37.725Z" })
  birthday: Date;

  @ApiPropertyOptional({ nullable: true, format: "binary" })
  profile_image: string;

  //  Banner pictuer
  @ApiPropertyOptional({ nullable: true, format: "binary" })
  bg_image: string;

  // Social Media
  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string;

  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
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
