import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  UseGuards,
  Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ProfileDto } from "./dto/profile.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consume.enum";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {
  multerDestination,
  multerFilename,
  multerStorage,
} from "src/common/utils/multer.util";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ProfileImages } from "./types/files.type";
import { UploadedOptionalFiles } from "src/common/decorators/uploadfile.decorator";
import { ChangeEmailDto } from "./entities/profile.entity";
import { Response } from "express";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { CookieOptions } from "src/common/utils/cookie.util";
import { PublicMessage } from "src/common/enums/message.enum";

@Controller("user")
@ApiTags("User")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: changeProfile to updateProfile
  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  // @UseInterceptors(FileInterceptor("bg_image"))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "profile_image", maxCount: 1 },
        { name: "bg_image", maxCount: 1 },
      ],
      {
        storage: multerStorage("user-profile"),
      }
    )
  )
  changeProfile(
    @UploadedOptionalFiles() files: ProfileImages,
    @Body()
    profileDto: ProfileDto
  ) {
    return this.userService.changeProfile(files, profileDto);
  }

  @Get("/profile")
  profile() {
    return this.userService.profile();
  }

  @Patch("/change-email")
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(
      emailDto.email
    );

    if (message) return res.json(message);

    res.cookie(CookieKeys.EmailOTP, token, CookieOptions());
    res.json({
      code,
      message: PublicMessage.SendOtp,
    });
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.userService.remove(+id);
  // }
}
