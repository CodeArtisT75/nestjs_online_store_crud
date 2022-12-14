import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './lib/config/typeorm.config';
import { HttpExceptionFilter } from './lib/filters/http-exception.filter';
import { UnhandledErrorExceptionFilter } from './lib/filters/unhandled-error-exception.filter';
import { ValidationErrorExceptionFilter } from './lib/filters/validation-error-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { ShoppingCartModule } from './modules/shopping-cart/shopping-cart.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    UsersModule,
    ProductsModule,
    AuthModule,
    ShoppingCartModule
  ],
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
