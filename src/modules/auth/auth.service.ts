import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthType } from "./enums/type.enum";
import { AuthMethod } from "./enums/method.enum";
import { isEmail, isMobilePhone } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "../user/entities/profile.entity";
import {
  AuthMessage,
  BadRequestMessage,
  PublicMessage,
} from "src/common/enums/message.enum";
import { OtpEntity } from "../user/entities/otp.entity";
import { randomInt } from "crypto";
import { TokenService } from "./tokens.service";
import { Request, Response } from "express";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { AuthResponse } from "./types/response";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,

    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,

    // make request available on all
    @Inject(REQUEST)
    private request: Request,

    private tokenService: TokenService
  ) {}

  // Endpoints
  async userExistence(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        return this.sendResponse(res, result);
      case AuthType.Register:
        result = await this.register(method, username);
        return this.sendResponse(res, result);
      default:
        throw new UnauthorizedException("Not Acceptable Login/Register");
    }
  }

  async checkOTP(code: string) {
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    return token;
  }

  // Helper methods

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    let user: UserEntity = await this.checkExistUser(method, validUsername);

    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);

    // Save OTP
    const otp = await this.saveOTP(user.id);

    // Create token that contains UserId, we use it identify the user
    const token = this.tokenService.createOtpToken({ userId: user.id });

    // Send Otp Code : SMS or Email
    this.sendOTP();

    return {
      token,
      code: otp.code,
    };
  }

  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);

    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (user) throw new ConflictException(AuthMessage.AlreadyExistUser);

    // user can't register with username
    if (method === AuthMethod.Username)
      throw new BadRequestException(BadRequestMessage.InValidRegisterData);

    user = this.userRepository.create({
      [method]: validUsername,
    });

    // Save new user
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);

    // Save OTP
    const otp = await this.saveOTP(user.id);

    // Create token that contains UserId, we use it identify the user
    const token = this.tokenService.createOtpToken({ userId: user.id });

    // Send Otp Code : SMS or Email
    this.sendOTP();

    return {
      token,
      code: otp.code,
    };
  }

  async sendResponse(res: Response, result: AuthResponse) {
    const { token, code } = result;
    res.cookie(CookieKeys.OTP, result.token, {
      httpOnly: true,
      expires: new Date(Date.now() + 120000),
    });
    res.json({
      message: PublicMessage.SendOtp,
      code,
    });
  }

  usernameValidator(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) {
          return username;
        }
        throw new BadRequestException("Email is not valid");

      case AuthMethod.Phone:
        if (isMobilePhone(username, "fa-IR")) {
          return username;
        }
        throw new BadRequestException("Phone is not valid");

      case AuthMethod.Username:
        return username;

      default:
        throw new UnauthorizedException("Not Acceptable Method");
    }
  }

  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity;
    if (method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({
        phone: username,
      });
    } else if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({
        email: username,
      });
    } else if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({
        username,
      });
    } else throw new UnauthorizedException(BadRequestMessage.InValidLoginData);

    return user;
  }

  async saveOTP(userId: number) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 120000);
    let otp = await this.otpRepository.findOneBy({ userId });
    let existOtp = false;

    if (otp) {
      existOtp = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        userId,
      });
    }

    otp = await this.otpRepository.save(otp);
    if (!existOtp)
      await this.userRepository.update({ id: userId }, { otpId: otp.id });

    return otp;
  }

  async sendOTP() {
    console.log("Send OTP via SMS/Email not Implemented yet");
  }
}
