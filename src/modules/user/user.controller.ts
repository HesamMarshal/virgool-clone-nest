import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  UseInterceptors,
  UseGuards,
  Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
  ChangeEmailDto,
  ChangePhoneDto,
  ChangeUsernameDto,
  ProfileDto,
} from "./dto/profile.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consume.enum";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "src/common/utils/multer.util";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ProfileImages } from "./types/files.type";
import { UploadedOptionalFiles } from "src/common/decorators/uploadfile.decorator";
import { Response } from "express";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { CookieOptions } from "src/common/utils/cookie.util";
import { PublicMessage } from "src/common/enums/message.enum";
import { CheckOtpDto } from "../auth/dto/auth.dto";

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

  @Post("/verify-email-otp")
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code);
  }

  @Patch("/change-phone")
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changePhone(
      phoneDto.phone
    );

    if (message) return res.json(message);

    res.cookie(CookieKeys.PhoneOTP, token, CookieOptions());
    res.json({
      code,
      message: PublicMessage.SendOtp,
    });
  }

  @Post("/verify-phone-otp")
  async verifyPhone(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyPhone(otpDto.code);
  }

  @Patch("/change-username")
  async changeUsername(@Body() changeUsernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(changeUsernameDto.username);
  }
}
