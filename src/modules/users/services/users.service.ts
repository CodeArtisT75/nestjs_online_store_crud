import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.name = createUserDto.name;
    user.role = createUserDto.role;

    return this.userRepository.save(user);
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id
      }
    });
  }

  public async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username
      }
    });
  }

  public async findOneByUsernameWithPassword(username: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  public async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.save(_.merge(user, updateUserDto));
  }

  public async remove(user: User): Promise<void> {
    await this.userRepository.delete({ id: user.id });
  }
}
