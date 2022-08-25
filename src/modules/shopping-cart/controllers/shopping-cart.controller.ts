import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards
} from '@nestjs/common';
import { HttpResponseContract } from '../../../lib/contracts/HttpResponseContract';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../../../lib/decorators/auth-user.decorator';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { User } from '../../users/entities/user.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { ProductsService } from '../../products/services/products.service';

@Controller('api/v1/cart')
@UseGuards(AuthGuard('jwt'))
export class ShoppingCartController {
  constructor(
    private shoppingCartService: ShoppingCartService,
    private productsService: ProductsService
  ) {}

  @Get()
  public async getCart(@AuthUser() user: User): Promise<HttpResponseContract> {
    const cart = await this.shoppingCartService.getUserCart(user);

    return {
      status: true,
      data: cart,
      message: 'Cart fetched successfully'
    };
  }

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
