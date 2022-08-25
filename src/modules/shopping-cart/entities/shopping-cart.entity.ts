import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'shopping_carts' })
export class ShoppingCart {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @ApiProperty()
  @Column({ name: 'product_id', type: 'integer' })
  productId: number;

  @ApiProperty()
  @Column({ type: 'integer', default: 0 })
  count: number;

  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  public createdAt: Date;

  @ApiProperty()
  @ManyToOne(_type => Product, product => product.cartItems, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'product_id' })
  public product: Product;

  @ManyToOne(_type => User, user => user.cartItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
