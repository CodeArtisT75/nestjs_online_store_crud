import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as Bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<User> {
    let user = await this.userService.findOneByUsernameWithPassword(loginDto.username);

    if (user) {
      if (await Bcrypt.compare(loginDto.password, user.password)) {
        delete user.password;
      } else {
        user = null;
      }
    }

    return user;
  }

  async token(user: User) {
    const payload = { id: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
