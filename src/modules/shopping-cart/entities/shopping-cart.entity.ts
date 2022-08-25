import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'shopping_carts' })
export class ShoppingCart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'product_id', type: 'integer' })
  productId: number;

  @Column({ type: 'integer', default: 0 })
  count: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  public createdAt: Date;

  @ManyToOne(_type => Product, product => product.cartItems, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'product_id' })
  public product: Product;

  @ManyToOne(_type => User, user => user.cartItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
