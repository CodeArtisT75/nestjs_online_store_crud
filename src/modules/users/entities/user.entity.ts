import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as Bcrypt from 'bcrypt';
import { UserRoles } from '../enums/user-roles.enum';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.CUSTOMER })
  role: string;

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await Bcrypt.genSalt();
    this.password = await Bcrypt.hash(this.password || this.password, salt);
  }

  @AfterInsert()
  @AfterUpdate()
  async deletePasswordFieldFromModel() {
    delete this.password;
  }

  @OneToMany(_type => ShoppingCart, cart => cart.user)
  public cartItems: Promise<ShoppingCart[]>;
}
