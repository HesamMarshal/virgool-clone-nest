import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CookePayload } from "./types/payloads";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createOtpToken(payload: CookePayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.OTP_TOKEN_SECRET,
      expiresIn: 120,
    });

    return token;
  }
}
