import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JwtGuard } from "./auth/guards/jwt.guard";
import "./config";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalGuards(new JwtGuard(app.get(Reflector)));
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (err) {}
}
bootstrap();
