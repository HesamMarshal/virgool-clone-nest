import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle("Virgool-Clone")
    .setDescription("Virgol Clone Backend")
    .setVersion("v0.0.1")
    .build();

  const swaggerDocumet = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("/swagger", app, swaggerDocumet);
}
