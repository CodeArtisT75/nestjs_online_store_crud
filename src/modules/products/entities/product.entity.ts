import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @ApiProperty()
  @Column({ type: 'decimal', default: 0 })
  price: number;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  public createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  public updatedAt: Date;

  @OneToMany(_type => ShoppingCart, cart => cart.product)
  cartItems: Promise<ShoppingCart[]>;
}
