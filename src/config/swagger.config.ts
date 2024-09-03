import { INestApplication, UseGuards } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle("Virgool-Clone")
    .setDescription("Virgol Clone Backend")
    .setVersion("v0.0.1")
    .addBearerAuth(SwaggerAuthConfig(), "Authorization")
    .build();

  const swaggerDocumet = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("/swagger", app, swaggerDocumet);
}

function SwaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: "http",
    bearerFormat: "JWT",
    in: "header",
    scheme: "bearer",
  };
}
