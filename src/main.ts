import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerConfigInit } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Confgure Swagger
  SwaggerConfigInit(app);

  // Start Server
  await app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
}
bootstrap();
