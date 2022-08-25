import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { HttpResponseContract } from '../../../lib/contracts/HttpResponseContract';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public async create(@Body() createProductDto: CreateProductDto): Promise<HttpResponseContract> {
    const product = await this.productsService.create(createProductDto);

    return {
      status: true,
      data: product,
      message: 'Created successfully'
    };
  }

  @Get()
  public async findAll(): Promise<HttpResponseContract> {
    const products = await this.productsService.findAll();

    return {
      status: true,
      data: products,
      message: 'Fetched successfully'
    };
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponseContract> {
    const product = await this.productsService.findOneById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      status: true,
      data: product,
      message: 'Fetched successfully'
    };
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<HttpResponseContract> {
    const product = await this.productsService.findOneById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updateProduct = await this.productsService.update(product, updateProductDto);

    return {
      status: true,
      data: updateProduct,
      message: 'Updated successfully'
    };
  }

  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponseContract> {
    const product = await this.productsService.findOneById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productHasCartItems = await this.productsService.checkProductHasCartItems(product);

    if (productHasCartItems) {
      throw new BadRequestException('Product has some cart-items');
    }

    await this.productsService.remove(product);

    return {
      status: true,
      data: null,
      message: 'Delete successfully'
    };
  }
}
