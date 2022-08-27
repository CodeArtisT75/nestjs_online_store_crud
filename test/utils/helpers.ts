import 'dotenv/config';
import * as path from 'path';
import * as _ from 'lodash';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { User } from '../../src/modules/users/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import { LoginDto } from '../../src/modules/auth/dto/login.dto';
import { Product } from '../../src/modules/products/entities/product.entity';

const TypeOrmDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [path.join(__dirname, '..', '..', 'src', '**', '*.entity.ts')],
  extra: {
    charset: 'utf8mb4_unicode_ci'
  },
  synchronize: false,
  logging: false
});

export async function clearDataBase() {
  try {
    const dataSource = await TypeOrmDataSource.initialize();
    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = await TypeOrmDataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE ${entity.tableName} CASCADE;`);
    }

    await dataSource.destroy();
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}

export function createUser(): User {
  const user = new User();
  user.username = 'user';
  user.password = '123456';
  user.name = 'user';

  return user;
}

export function createProduct(): Product {
  const product = new Product();
  product.name = 'Food';
  product.description = 'Food description';
  product.price = 1000;
  product.quantity = 100;

  return product;
}

export async function storeUserInDatabase(user: User) {
  try {
    const dataSource = await TypeOrmDataSource.initialize();

    const repository = await TypeOrmDataSource.getRepository(User);
    await repository.save(_.cloneDeep(user));

    await dataSource.destroy();
  } catch (error) {
    throw new Error(`Can not create user`);
  }
}

export async function storeProductInDatabase(product: Product) {
  try {
    const dataSource = await TypeOrmDataSource.initialize();

    const repository = await TypeOrmDataSource.getRepository(Product);
    const _product = await repository.save(product);

    await dataSource.destroy();

    return _product;
  } catch (error) {
    throw new Error(`Can not create product`);
  }
}

export async function getJWTTokenForUser(app: INestApplication, user: User): Promise<string> {
  const loginData: LoginDto = {
    username: user.username,
    password: user.password
  };
  const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData);

  return response.body.data.access_token;
}
