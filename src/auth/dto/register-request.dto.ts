import { IsEmail, IsString } from "class-validator";

// DTO of Register Request
export class RegisterRequestDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
