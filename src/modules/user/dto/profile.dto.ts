import { ApiPropertyOptional } from "@nestjs/swagger";
import { Length } from "class-validator";
import { Gender } from "../enums/gender.enum";

export class ProfileDto {
  @ApiPropertyOptional()
  @Length(3, 50)
  nick_name: string;

  @ApiPropertyOptional({ nullable: true })
  @Length(10, 200)
  bio: string;

  @ApiPropertyOptional({ nullable: true, format: "binary" })
  profile_image: string;

  //  Banner pictuer
  @ApiPropertyOptional({ nullable: true, format: "binary" })
  bg_image: string;

  @ApiPropertyOptional({ nullable: true, enum: Gender })
  gender: string;

  @ApiPropertyOptional({ nullable: true, example: "2024-09-04T10:03:37.725Z" })
  birthday: Date;

  // Social Media
  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string;

  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
}
