import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserRoles } from "src/common/guards/roles.guard";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { AccessToken } from "./types/AccessToken";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // validate user with email and password
  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Password does not match");
    }
    return user;
  }

  // generate access token after login
  async login(user: User): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  // register
  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException("email already exists");
    }
    // save hashed password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const roles: string[] = [UserRoles.user];

    // Temporary code for admin
    if (user.email === "admin@gmail.com") {
      roles.push(UserRoles.admin);
    }

    const newUser: User = { ...user, password: hashedPassword, roles: roles };
    await this.usersService.create(newUser);
    return this.login(newUser);
  }
}
