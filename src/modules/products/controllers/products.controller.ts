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
  BadRequestException,
  UseGuards,
  HttpStatus
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponseContract } from '../../../lib/decorators/api-response-contract.decorator';
import { HttpResponseContract } from '../../../lib/contracts/HttpResponseContract';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('api/v1/products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponseContract({ status: HttpStatus.CREATED, model: Product })
  @Post()
  public async create(@Body() createProductDto: CreateProductDto): Promise<HttpResponseContract> {
    const product = await this.productsService.create(createProductDto);

    return {
      status: true,
      data: product,
      message: 'Created successfully'
    };
  }

  @ApiResponseContract({ model: [Product] })
  @Get()
  public async findAll(): Promise<HttpResponseContract> {
    const products = await this.productsService.findAll();

    return {
      status: true,
      data: products,
      message: 'Fetched successfully'
    };
  }

  @ApiResponseContract({ model: Product })
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

  @ApiResponseContract({ model: Product })
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

  @ApiResponseContract({ model: null })
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
