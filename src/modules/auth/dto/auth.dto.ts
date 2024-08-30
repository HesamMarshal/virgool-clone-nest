import { ApiProperty } from "@nestjs/swagger";
import { AuthType } from "../enums/type.enum";
import { AuthMethod } from "../enums/method.enum";
import { IsEnum, IsString, Length } from "class-validator";

export class AuthDto {
  @ApiProperty() // To show on swagger
  @IsString()
  @Length(3, 100)
  username: string;

  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: string;

  @ApiProperty({ enum: AuthMethod })
  @IsEnum(AuthMethod)
  method: AuthMethod;
}
