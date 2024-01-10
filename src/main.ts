import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
// import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3001;
    app.enableCors();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const config = new DocumentBuilder()
      .setTitle('MyTest')
      .setDescription('REST API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('NestJS, Postgres')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
    await app.listen(PORT, () => {
      console.log('Server listening on port', PORT);
    });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
bootstrap();
