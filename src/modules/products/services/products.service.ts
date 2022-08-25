import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';
import { ShoppingCartRepository } from '../../shopping-cart/repositories/shopping-cart.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: ProductRepository,
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: ShoppingCartRepository
  ) {}

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product();

    return this.productRepository.save(_.merge(product, createProductDto));
  }

  public async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  public async findOneById(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id }
    });
  }

  public async update(product: Product, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productRepository.save(_.merge(product, updateProductDto));
  }

  public async remove(product: Product): Promise<void> {
    await this.productRepository.delete({
      id: product.id
    });
  }

  public async checkProductHasCartItems(product: Product): Promise<boolean> {
    const hasItems = await this.shoppingCartRepository
      .createQueryBuilder('item')
      .where('item.product_id = :product_id', { product_id: product.id })
      .getCount();

    return Boolean(hasItems);
  }
}
