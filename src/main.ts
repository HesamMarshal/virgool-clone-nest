import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerConfigInit } from "./config/swagger.config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Confgure Swagger
  SwaggerConfigInit(app);

  // Activate Cookie Parser
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Start Server
  const { PORT } = process.env;
  await app.listen(PORT, () => {
    console.log(`Root:    http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
