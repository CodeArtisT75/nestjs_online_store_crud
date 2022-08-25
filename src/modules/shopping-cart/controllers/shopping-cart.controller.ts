import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponseContract } from '../../../lib/decorators/api-response-contract.decorator';
import { HttpResponseContract } from '../../../lib/contracts/HttpResponseContract';
import { AuthUser } from '../../../lib/decorators/auth-user.decorator';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { User } from '../../users/entities/user.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { ProductsService } from '../../products/services/products.service';
import { ShoppingCart } from '../entities/shopping-cart.entity';

@ApiTags('Shopping Cart')
@Controller('api/v1/cart')
@UseGuards(AuthGuard('jwt'))
export class ShoppingCartController {
  constructor(
    private shoppingCartService: ShoppingCartService,
    private productsService: ProductsService
  ) {}

  @ApiResponseContract({ model: [ShoppingCart] })
  @Get()
  public async getCart(@AuthUser() user: User): Promise<HttpResponseContract> {
    const cart = await this.shoppingCartService.getUserCart(user);

    return {
      status: true,
      data: cart,
      message: 'Cart fetched successfully'
    };
  }

  @ApiResponseContract({ status: HttpStatus.CREATED, model: null })
  @Post()
  public async addItemToCart(
    @AuthUser() user: User,
    @Body() addToCartDto: AddToCartDto
  ): Promise<HttpResponseContract> {
    const product = await this.productsService.findOneById(addToCartDto.productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.shoppingCartService.addItemToUserCart(user, product.id, addToCartDto.count);

    return {
      status: true,
      data: null,
      message: 'Item added successfully'
    };
  }

  @ApiResponseContract({ model: null })
  @Delete(':productId')
  public async deleteItemFromCart(
    @Param('productId', ParseIntPipe) productId: number,
    @AuthUser() user: User
  ): Promise<HttpResponseContract> {
    await this.shoppingCartService.deleteItemFromUserCart(user, productId);

    return {
      status: true,
      data: null,
      message: 'Item deleted successfully'
    };
  }
}
