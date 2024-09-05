import { Inject, Injectable, Scope } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
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

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,

    @Inject(REQUEST) private request: Request
  ) {}

  async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
    console.log(files);

    // let { profile_image, bg_image } = files;
    if (files?.profile_image?.length > 0) {
      let [image] = files?.profile_image;
      profileDto.profile_image = image.path;
    }
    if (files?.bg_image?.length > 0) {
      let [image] = files?.bg_image;
      profileDto.bg_image = image.path;
      console.log(image.path);
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
    return profile;
  }

  profile() {
    const { id } = this.request.user;
    return this.userRepository.findOne({
      where: { id },
      relations: ["profile"],
    });
  }
  // create(createUserDto: CreateUserDto) {
  //   return "This action adds a new user";
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
