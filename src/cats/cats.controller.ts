import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard, UserRoles } from "../common/guards/roles.guard";
import { ParseIntPipe } from "../common/pipes/parse-int.pipe";
import { Cat } from "./cat.entity";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";

@UseGuards(RolesGuard)
@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Roles([UserRoles.admin])
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id", new ParseIntPipe())
    id: number
  ) {
    return this.catsService.findOne(id);
  }
}
