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

    // make request available on all scope
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
    // Checks if the code in browser cookie is equal to the code in DB
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    const { userId } = this.tokenService.verifyOtpToken(token);
    const otp = await this.otpRepository.findOneBy({ userId: userId });

    // TODO:  Improve messages
    if (!otp) throw new UnauthorizedException(AuthMessage.LoginAgain);

    const now = new Date();
    if (otp.expiresIn < now)
      throw new UnauthorizedException(AuthMessage.ExpiredCode);

    if (otp.code !== code)
      throw new UnauthorizedException(AuthMessage.TryAgain);

    return {
      message: PublicMessage.LoggedIn,
    };
  }

  // Helper methods

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);

    // Check if username is in DB
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    // TODO: do we need it? it is an extra check to me
    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);

    // Create and Save OTP in DB
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

    // user can't register with username - Register only by email or phone
    if (method === AuthMethod.Username)
      throw new BadRequestException(BadRequestMessage.InValidRegisterData);

    user = this.userRepository.create({
      [method]: validUsername,
    });

    // Save new user
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);

    // Create and Save OTP in DB
    const otp = await this.saveOTP(user.id);

    // Create token that contains UserId, we use it to identify the user
    const token = this.tokenService.createOtpToken({ userId: user.id });

    // Send Otp Code : SMS or Email
    this.sendOTP();

    return {
      token,
      code: otp.code,
    };
  }

  usernameValidator(method: AuthMethod, username: string) {
    // This method checks if username is email/phone/user name, and checks if they are in correct format
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
    // checks if username is in DB or not
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
    // Create OTP code and save in DB
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 120000);

    // Check if userId is available in DB
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

  async sendResponse(res: Response, result: AuthResponse) {
    // Send token and code??? to the client

    // TODO: in production we dont need code to be sent
    const { token, code } = result;
    res.cookie(CookieKeys.OTP, token, {
      httpOnly: true,
      expires: new Date(Date.now() + 120000),
    });
    res.json({
      message: PublicMessage.SendOtp,
      code,
    });
  }

  async sendOTP() {
    console.log("Send OTP via SMS/Email not Implemented yet");
  }
}
