import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { isNotEmpty, IsNotEmpty, IsNumber, Length } from "class-validator";

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 150)
  title: string;

  @ApiPropertyOptional()
  slug: string;

  @ApiPropertyOptional({ format: "binary" })
  image: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  time_for_study: number;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 300)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 100)
  content: string;
}
