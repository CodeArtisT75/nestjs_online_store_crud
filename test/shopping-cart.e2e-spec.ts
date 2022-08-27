import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  clearDataBase,
  createProduct,
  createUser,
  getJWTTokenForUser,
  storeProductInDatabase,
  storeUserInDatabase
} from './utils/helpers';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/users/entities/user.entity';
import { Product } from '../src/modules/products/entities/product.entity';
import { AddToCartDto } from '../src/modules/shopping-cart/dto/add-to-cart.dto';

describe('Shopping-cart module (e2e)', () => {
  let app: INestApplication;
  const user: User = createUser();
  let product: Product;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeAll(async () => {
    await clearDataBase();
    await storeUserInDatabase(user);
    product = await storeProductInDatabase(createProduct());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Add item shopping-cart', function () {
    it('Adds item to user`s shopping-cart', async () => {
      const token = await getJWTTokenForUser(app, user);

      const shoppingCartDto: AddToCartDto = {
        productId: product.id,
        count: 10
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${token}`)
        .send(shoppingCartDto);

      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('Getting Shopping-cart', function () {
    it('Get user`s shopping-cart', async () => {
      const token = await getJWTTokenForUser(app, user);

      const response = await request(app.getHttpServer())
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBeGreaterThan(0); // we added item in previous test
      expect(response.body.data[0].productId).toBe(product.id);
    });
  });

  describe('remove item from shopping-cart', function () {
    it('removes item from user`s shopping-cart', async () => {
      const token = await getJWTTokenForUser(app, user);

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/cart/${product.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
    });
  });
});
