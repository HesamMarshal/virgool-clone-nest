import { ConflictException, Inject, Injectable, Scope } from "@nestjs/common";
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
import { PublicMessage, UserMessage } from "src/common/enums/message.enum";
import { AuthService } from "../auth/auth.service";
import { TokenService } from "../auth/tokens.service";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,

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
    user.new_email = email;
    const otp = await this.authService.saveOTP(user.id);
    const token = await this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }
}
