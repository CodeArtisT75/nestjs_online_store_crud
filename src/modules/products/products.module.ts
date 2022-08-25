import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { Product } from './entities/product.entity';
import { ShoppingCart } from '../shopping-cart/entities/shopping-cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ShoppingCart])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
