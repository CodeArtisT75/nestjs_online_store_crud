import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  UseGuards,
  HttpStatus
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HttpResponseContract } from '../../../lib/contracts/HttpResponseContract';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiResponseContract } from '../../../lib/decorators/api-response-contract.decorator';
import { User } from '../entities/user.entity';

@ApiTags('Users')
@Controller('api/v1/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponseContract({ status: HttpStatus.CREATED, model: User })
  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<HttpResponseContract> {
    const userExists = await this.usersService.findOneByUsername(createUserDto.username);

    if (userExists) {
      throw new BadRequestException('User exists with this username');
    }

    const user = await this.usersService.create(createUserDto);

    return {
      status: true,
      data: user,
      message: 'Created successfully'
    };
  }

  @ApiResponseContract({ model: [User] })
  @Get()
  public async findAll(): Promise<HttpResponseContract> {
    const users = await this.usersService.findAll();

    return {
      status: true,
      data: users,
      message: 'Fetched successfully'
    };
  }

  @ApiResponseContract({ model: User })
  @Get(':id')
  public async findOneById(@Param('id', ParseIntPipe) id: number): Promise<HttpResponseContract> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: true,
      data: user,
      message: 'Fetched successfully'
    };
  }

  @ApiResponseContract({ model: User })
  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<HttpResponseContract> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersService.update(user, updateUserDto);

    return {
      status: true,
      data: updatedUser,
      message: 'Updated successfully'
    };
  }

  @ApiResponseContract({ model: null })
  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<HttpResponseContract> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userHasSomeItemsInCart = await this.usersService.checkUserHasItemsInShoppingCart(user);

    if (userHasSomeItemsInCart) {
      throw new BadRequestException('User has some items in shopping-cart');
    }

    await this.usersService.remove(user);

    return {
      status: true,
      data: null,
      message: 'Deleted successfully'
    };
  }
}
