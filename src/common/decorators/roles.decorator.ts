import { Reflector } from "@nestjs/core";
import { UserRoles } from "../guards/roles.guard";

export const Roles = Reflector.createDecorator<UserRoles[]>();
