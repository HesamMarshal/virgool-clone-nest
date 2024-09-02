import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CookiePayload } from "./types/payloads";
import { AuthMessage } from "src/common/enums/message.enum";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createOtpToken(payload: CookiePayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.OTP_TOKEN_SECRET,
      expiresIn: 120,
    });

    return token;
  }

  verifyOtpToken(token: string): CookiePayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.OTP_TOKEN_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }
}
