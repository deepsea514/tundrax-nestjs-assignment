import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

import { AuthGuard } from "@nestjs/passport";
import { Public } from "../common/decorators/public.decorator";
import { LoginResponseDTO } from "./dto/login-response.dto";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { RegisterResponseDTO } from "./dto/register-response.dto";

@Public()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post("register")
  async register(
    @Body() registerBody: RegisterRequestDto
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}
