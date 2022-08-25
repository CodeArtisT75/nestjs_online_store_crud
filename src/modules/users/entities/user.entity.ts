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
import * as Bcrypt from 'bcrypt';
import { UserRoles } from '../enums/user-roles.enum';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.CUSTOMER })
  role: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  public createdAt: Date;

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
