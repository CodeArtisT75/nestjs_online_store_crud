import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  clearDataBase,
  createUser,
  getJWTTokenForUser,
  storeUserInDatabase
} from './utils/helpers';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/users/entities/user.entity';
import { CreateProductDto } from '../src/modules/products/dto/create-product.dto';
import { UpdateProductDto } from '../src/modules/products/dto/update-product.dto';

describe('Product module (e2e)', () => {
  let app: INestApplication;
  const user: User = createUser();
  let createdProductId;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Storing and updating products', function () {
    it('Should store a product', async () => {
      const token = await getJWTTokenForUser(app, user);

      const storeProductDto: CreateProductDto = {
        name: 'product name',
        description: 'product description',
        price: 100,
        quantity: 10
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(storeProductDto);

      createdProductId = response.body.data.id;

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(storeProductDto.name);
    });

    it('Should update an existing product', async () => {
      const token = await getJWTTokenForUser(app, user);

      const updateProductDto: UpdateProductDto = {
        name: 'product name updated',
        description: 'product description updated',
        price: 200,
        quantity: 20
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateProductDto);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(updateProductDto.name);
    });
  });

  describe('Getting products', function () {
    it('Get product list', async () => {
      const token = await getJWTTokenForUser(app, user);

      const response = await request(app.getHttpServer())
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBeGreaterThan(0); // we created a product at previous test
    });

    it('Get product by ID', async () => {
      const token = await getJWTTokenForUser(app, user);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.name).toBeDefined(); // we created a product at previous test
    });
  });

  describe('Deleting a product', function () {
    it('Delete a product by ID', async () => {
      const token = await getJWTTokenForUser(app, user);

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
    });
  });
});
