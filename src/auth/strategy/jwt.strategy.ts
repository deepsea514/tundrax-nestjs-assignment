import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("AUTH_SECRET_KEY"),
    });
  }

  async validate(payload: any) {
    const existingUser = await this.usersService.findOneByEmail(payload.email);
    if (existingUser)
      return {
        userId: payload.id,
        email: payload.email,
        roles: existingUser.roles,
      };
    return null;
  }
}
