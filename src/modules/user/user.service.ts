import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { ProfileDto } from "./dto/profile.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { isDate } from "class-validator";
import { Gender } from "./enums/gender.enum";
import { ProfileImages } from "./types/files.type";
import {
  AuthMessage,
  BadRequestMessage,
  PublicMessage,
  UserMessage,
} from "src/common/enums/message.enum";
import { AuthService } from "../auth/auth.service";
import { TokenService } from "../auth/tokens.service";
import { OtpEntity } from "./entities/otp.entity";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { AuthMethod } from "../auth/enums/method.enum";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,

    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,

    @Inject(REQUEST) private request: Request,

    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
    // let { profile_image, bg_image } = files;
    if (files?.profile_image?.length > 0) {
      let [image] = files?.profile_image;
      profileDto.profile_image = image?.path.slice(7);
    }
    if (files?.bg_image?.length > 0) {
      let [image] = files?.bg_image;
      profileDto.bg_image = image?.path.slice(7);
    }

    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const {
      nick_name,
      bio,
      gender,
      birthday,
      profile_image,
      bg_image,
      linkedin_profile,
      x_profile,
    } = profileDto;

    if (profile) {
      // update profile data
      if (nick_name) profile.nick_name = nick_name;
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday)))
        profile.birthday = new Date(birthday);
      if (gender && Object.values(Gender as any).includes(gender))
        profile.gender = gender;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (profile_image) profile.profile_image = profile_image;
      if (bg_image) profile.bg_image = bg_image;
    } else {
      //  create new profile
      profile = this.profileRepository.create({
        nick_name,
        bio,
        gender,
        birthday,
        profile_image,
        bg_image,
        linkedin_profile,
        x_profile,
        userId,
      });
    }

    profile = await this.profileRepository.save(profile);

    if (!profileId)
      await this.userRepository.update(
        // Where
        { id: userId },
        // Update items:
        { profileId: profile.id }
      );
    return {
      message: UserMessage.Updated,
    };
  }

  profile() {
    const { id } = this.request.user;
    return this.userRepository.findOne({
      where: { id },
      relations: ["profile"],
    });
  }

  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ email });
    if (user && user.id !== id)
      throw new ConflictException(UserMessage.ConflictEmail);
    else if (user && user.id === id) {
      return { message: PublicMessage.Updated };
    }

    await this.userRepository.update({ id }, { new_email: email });
    const otp = await this.authService.saveOTP(id, AuthMethod.Email);
    const token = await this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;

    const token = this.request.cookies?.[CookieKeys.EmailOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { email } = this.tokenService.verifyEmailToken(token);

    if (email !== new_email)
      throw new BadRequestException(BadRequestMessage.SomethingWrong);

    const otp = await this.checkOtp(userId, code);

    if (otp.method !== AuthMethod.Email)
      throw new BadRequestException(BadRequestMessage.SomethingWrong);

    // Create access token
    // const accessToken = this.tokenService.createAccessToken({ userId });
    await this.userRepository.update(
      { id: userId },
      {
        email,
        verify_email: true,
        new_email: null,
      }
    );

    return {
      message: UserMessage.Updated,
      // accessToken,
    };
  }
  async changePhone(phone: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ phone });
    if (user && user.id !== id)
      throw new ConflictException(UserMessage.ConflictPhone);
    else if (user && user.id === id) {
      return { message: PublicMessage.Updated };
    }

    await this.userRepository.update({ id }, { new_phone: phone });
    const otp = await this.authService.saveOTP(id, AuthMethod.Phone);
    const token = await this.tokenService.createPhoneToken({ phone });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.request.user;

    const token = this.request.cookies?.[CookieKeys.PhoneOTP];
    console.log(token);

    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { phone } = this.tokenService.verifyPhoneToken(token);

    if (phone !== new_phone)
      throw new BadRequestException(BadRequestMessage.SomethingWrong);

    const otp = await this.checkOtp(userId, code);

    if (otp.method !== AuthMethod.Phone)
      throw new BadRequestException(BadRequestMessage.SomethingWrong);

    await this.userRepository.update(
      { id: userId },
      {
        phone,
        verify_phone: true,
        new_phone: null,
      }
    );

    return {
      message: UserMessage.Updated,
      // accessToken,
    };
  }

  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException(AuthMessage.NotFoundAccount);
    const now = new Date();
    if (otp.expiresIn < now)
      throw new BadRequestException(AuthMessage.ExpiredCode);

    if (otp.code !== code) throw new BadRequestException(AuthMessage.TryAgain);

    return otp;
  }

  async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ username });
    if (user && user.id !== id)
      throw new ConflictException(UserMessage.ConflictUsername);
    else if (user && user.id === id) {
      return { message: PublicMessage.Updated };
    }

    await this.userRepository.update({ id }, { username: username });
    return { message: PublicMessage.Updated };
  }
}
