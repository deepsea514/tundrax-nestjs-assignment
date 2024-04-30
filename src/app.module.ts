import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { JwtGuard } from "./auth/guards/jwt.guard";
import { Cat } from "./cats/cat.entity";
import { CatsModule } from "./cats/cats.module";
import { CoreModule } from "./core/core.module";
import { User } from "./users/users.entity";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRESQL_HOST"),
        port: configService.get<number>("POSTGRESQL_HOST") || 5432,
        username: configService.get<string>("POSTGRESQL_USERNAME"),
        password: configService.get<string>("POSTGRESQL_PASSWORD"),
        database: configService.get<string>("POSTGRESQL_DATABASE"),
        autoLoadEntities: true,
        synchronize: true,
        entities: [Cat, User],
      }),
      inject: [ConfigService],
    }),
    CoreModule,
    CatsModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
