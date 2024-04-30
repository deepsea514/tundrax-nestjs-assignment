import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatsModule } from "./cats/cats.module";
import { Cat } from "./cats/interfaces/cat.interface";
import "./config";
import { CoreModule } from "./core/core.module";

const {
  POSTGRESQL_HOST,
  POSTGRESQL_USERNAME,
  POSTGRESQL_PASSWORD,
  POSTGRESQL_DATABASE,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: POSTGRESQL_HOST,
      port: 5432,
      username: POSTGRESQL_USERNAME,
      password: POSTGRESQL_PASSWORD,
      database: POSTGRESQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: [Cat],
    }),
    CoreModule,
    CatsModule,
  ],
})
export class AppModule {}
