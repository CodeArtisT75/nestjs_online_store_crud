import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpResponseContract } from '../../../lib/contracts/HttpResponseContract';
import { AuthService } from '../services/auth.service';
import { AuthUser } from '../../../lib/decorators/auth-user.decorator';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { UserRoles } from '../../users/enums/user-roles.enum';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private usersService: UsersService) {}

  @Post('/register')
  public async register(@Body() registerDto: RegisterDto): Promise<HttpResponseContract> {
    const userExists = await this.usersService.findOneByUsername(registerDto.username);

    if (userExists) {
      throw new BadRequestException('User exists with this username');
    }

    const user = await this.usersService.create({
      ...registerDto,
      role: UserRoles.CUSTOMER
    });

    const token = await this.authService.token(user);

    return {
      status: true,
      data: token,
      message: 'Created successfully'
    };
  }

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  public async login(@AuthUser() user: User): Promise<HttpResponseContract> {
    const token = await this.authService.token(user);
    return {
      status: true,
      data: token,
      message: 'Logged-in successfully'
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  async getCurrentUser(@AuthUser() user: User): Promise<HttpResponseContract> {
    return {
      status: true,
      data: user,
      message: 'user fetched successfully'
    };
  }
}
