import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HttpExceptionFilter } from './lib/filters/http-exception.filter';
import { UnhandledErrorExceptionFilter } from './lib/filters/unhandled-error-exception.filter';
import { ValidationErrorExceptionFilter } from './lib/filters/validation-error-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: UnhandledErrorExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: ValidationErrorExceptionFilter
    }
  ]
})
export class AppModule {}
