import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerConfigInit } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Confgure Swagger
  SwaggerConfigInit(app);

  // Start Server
  const { PORT } = process.env;
  await app.listen(PORT, () => {
    console.log(`Root:    http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
