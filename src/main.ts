import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerConfigInit } from "./config/swagger.config";
import * as cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Confgure Swagger
  SwaggerConfigInit(app);

  // Static folder
  app.useStaticAssets("public");

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
