import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './lib/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('NestJS Online store example')
    .setDescription('API Docs of online store example with NestJS')
    .setVersion('1.0')
    .addTag('Home')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Products')
    .addTag('Shopping Cart')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.APP_PORT, process.env.APP_HOST);
}

bootstrap();
