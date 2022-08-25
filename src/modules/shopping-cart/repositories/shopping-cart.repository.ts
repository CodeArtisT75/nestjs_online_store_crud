import { Repository } from 'typeorm';
import { ShoppingCart } from '../entities/shopping-cart.entity';

export class ShoppingCartRepository extends Repository<ShoppingCart> {}
