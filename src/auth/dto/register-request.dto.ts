import { IsEmail, IsString } from "class-validator";

export class RegisterRequestDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
