import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCartRepository } from '../repositories/shopping-cart.repository';
import { ShoppingCart } from '../entities/shopping-cart.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: ShoppingCartRepository
  ) {}

  public async getUserCart(user: User) {
    return await user.cartItems;
  }

  public async addItemToUserCart(user: User, productId: number, count: number) {
    const cartItem = new ShoppingCart();
    cartItem.productId = productId;
    cartItem.userId = user.id;
    cartItem.count = count;

    await this.shoppingCartRepository.save(cartItem);
  }

  public async deleteItemFromUserCart(user: User, productId: number) {
    await this.shoppingCartRepository.delete({
      productId,
      userId: user.id
    });
  }
}
